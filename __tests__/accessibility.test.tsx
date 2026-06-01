import React from 'react'
import { render } from '@testing-library/react-native'
import { screen } from '@testing-library/react-native'

// Mock all native modules
jest.mock('@react-native-firebase/auth', () => () => ({
  currentUser: { uid: 'test-uid' },
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock('@/store/notesStore', () => ({
  useNotesStore: jest.fn(() => ({
    notes: [],
    loading: false,
    fetchNotes: jest.fn(),
  })),
}))

jest.mock('@/store/tagsStore', () => ({
  useTagsStore: jest.fn(() => ({
    tags: [],
    loading: false,
    fetchTags: jest.fn(),
  })),
}))

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({ id: 'test-id' })),
}))

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
}))

jest.mock('@shopify/flash-list', () => {
  const { FlatList } = require('react-native')
  return { FlashList: FlatList }
})

// Import screens after mocks
import AuthScreen from '@/app/auth'

describe('Accessibility — Auth Screen', () => {
  it('has accessible email input', () => {
    const { getByPlaceholderText } = render(<AuthScreen />)
    const emailInput = getByPlaceholderText('Email')
    expect(emailInput).toBeTruthy()
  })

  it('has accessible password input', () => {
    const { getByPlaceholderText } = render(<AuthScreen />)
    const passwordInput = getByPlaceholderText('Password')
    expect(passwordInput).toBeTruthy()
  })

  it('has accessible sign in button', () => {
    const { getByText } = render(<AuthScreen />)
    const signInButton = getByText('Sign In')
    expect(signInButton).toBeTruthy()
  })

  it('has accessible toggle to sign up', () => {
    const { getByText } = render(<AuthScreen />)
    const toggleText = getByText("Don't have an account? Sign up")
    expect(toggleText).toBeTruthy()
  })

  it('renders NoteFlow heading', () => {
    const { getByText } = render(<AuthScreen />)
    const heading = getByText('NoteFlow')
    expect(heading).toBeTruthy()
  })
})