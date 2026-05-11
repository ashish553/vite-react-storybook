// JSONPlaceholder API for TanStack Query POC demonstrations
// https://jsonplaceholder.typicode.com/

export interface User {
  id: number
  name: string
  email: string
  username: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

// Counter for demonstrating request deduplication
let requestCount = 0

// Simulate random failures for retry demonstration
const shouldFail = () => {
    const fail = Math.random()
    console.log('Retrying...');
    console.log(fail);
    return fail < 0.2 // 90% chance of failure
}

// Base URL for JSONPlaceholder
const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Fetch users - demonstrates caching and deduplication
export const fetchUsers = async (context: object, source: any): Promise<User[]> => {
  requestCount++
  console.log(`${source ? `[${source}]` : ''} [API] Fetching users from JSONPlaceholder... (request #${requestCount})`)

  const response = await fetch(`${BASE_URL}/users`)
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  return response.json()
}

// Fetch user by ID - demonstrates retry logic
export const fetchUserById = async (id: number): Promise<User> => {
  console.log(`[API] Fetching user ${id} from JSONPlaceholder...`)

  if (shouldFail()) {
    throw new Error(`Failed to fetch user ${id}`)
  }

  const response = await fetch(`${BASE_URL}/users/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch user ${id}`)
  }

  return response.json()
}

// Fetch posts - demonstrates staleness
export const fetchPosts = async (userId?: number): Promise<Post> => {
  console.log(`[API] Fetching posts${userId ? ` for user ${userId}` : ''} from JSONPlaceholder...`)

  const url = `${BASE_URL}/posts/1`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
}

// Update a post - demonstrates optimistic updates
// Note: JSONPlaceholder doesn't actually persist changes, but this simulates a real API
export const updatePost = async (postId: number, updates: Partial<Post>): Promise<Post> => {
  console.log(`[API] Updating post ${postId}...`, updates)

  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error(`Failed to update post ${postId}`)
  }

  // JSONPlaceholder returns the updated post, but doesn't actually persist it
  return response.json()
}

// Create a new post - demonstrates optimistic updates
export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  console.log(`[API] Creating post...`, post)

  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  })

  if (!response.ok) {
    throw new Error('Failed to create post')
  }

  // JSONPlaceholder returns the created post with a fake ID
  return response.json()
}

// Reset request counter
export const getRequestCount = () => requestCount
export const resetRequestCount = () => {
  requestCount = 0
}
