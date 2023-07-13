import test from 'japa'

import { User, Attribute } from '../../src/interfaces'
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

  test.group('UserManager.getAttributes', (group) => {
    group.beforeEach(() => {
      mockAxiosInstance.refresh()
    })

    test('should call the endpoint once for the provided user id', async (assert) => {
      const fakeId = '1'
      const expectedNumberOfGetCalls = 1;

      await userManager.getAttributes(fakeId)

      assert.isAtLeast(mockAxiosInstance._getCalls, expectedNumberOfGetCalls)
    })
  })

  test.group('UserManager.addAttributes', (group) => {
    group.beforeEach(() => {
      mockAxiosInstance.refresh()
    })

    test('should call both get and put endpoint for the provided user id', async (assert) => {
      const fakeId = '1'
      const fakeAttributes: Attribute[] = [
        {key: 'country',
        value: ['mx']},
        {key: 'phone area code',
        value: ['+52']}
      ]

      const expectedNumberOfGetCalls = 1;
      const expectedNumberOfPutCalls = 1;

      await userManager.addAttributes(fakeId, fakeAttributes)

      assert.isAtLeast(mockAxiosInstance._getCalls, expectedNumberOfGetCalls)
      assert.isAtLeast(mockAxiosInstance._putCalls, expectedNumberOfPutCalls)
    })
  })

  test('should call the endpoint once for each id and one time more', async (assert) => {
    const fakeIdsList = ['1', '2', '3']
    const expectedNumberOfGetCalls = fakeIdsList.length + 1

    await userManager.roles(fakeId, fakeIdsList, true)

    assert.isAtLeast(mockAxiosInstance._getCalls, expectedNumberOfGetCalls)
  })
})
