import test from 'japa'

import { User } from '../../src/interfaces'
import AccessToken from '../../src/AccessToken'
import UserManager from '../../src/UserManager'
import { mockConfig, mockAxiosInstance } from '../setup'

const accessToken = new AccessToken(mockConfig, mockAxiosInstance)
const userManager = new UserManager(mockConfig, mockAxiosInstance, accessToken)
const fakeId = '0'

test.group('UserManager.details', () => {
  test('should call the endpoint once', async (assert) => {
    await userManager.details(fakeId)

    assert.equal(mockAxiosInstance._getCalls, 2)
  })
})

mockAxiosInstance.refresh()

test.group('UserManager.create', () => {
  test('should call tree endpoints', async (assert) => {
    const fakeUserData: User = {
      id: '',
      email: '',
      enabled: false,
      username: '',
      firstName: '',
      lastName: '',
      password: '',
    }

    await userManager.create(fakeUserData)

    assert.equal(mockAxiosInstance._putCalls, 2)
    assert.isAtLeast(mockAxiosInstance._getCalls, 1)
    assert.isAtLeast(mockAxiosInstance._postCalls, 1)
  })
})

mockAxiosInstance.refresh()

test.group('UserManager.roles', (group) => {
  group.beforeEach(() => {
    mockAxiosInstance.refresh()
  })

  test('should call the endpoint once for each id', async (assert) => {
    const fakeIdsList = ['1', '2', '3']
    const expectedNumberOfGetCalls = fakeIdsList.length

    await userManager.roles(fakeId, fakeIdsList)

    assert.isAtLeast(mockAxiosInstance._getCalls, expectedNumberOfGetCalls)
  })

  test('should call the endpoint once for each id and one time more', async (assert) => {
    const fakeIdsList = ['1', '2', '3']
    const expectedNumberOfGetCalls = fakeIdsList.length + 1

    await userManager.roles(fakeId, fakeIdsList, true)

    assert.isAtLeast(mockAxiosInstance._getCalls, expectedNumberOfGetCalls)
  })
})
