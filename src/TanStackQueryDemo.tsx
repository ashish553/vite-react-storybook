import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  fetchUsers,
  fetchUserById,
  fetchPosts,
  updatePost,
  createPost,
  type Post,
} from '../lib/api'

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    marginBottom: '30px',
    borderBottom: '2px solid var(--border-color)',
    paddingBottom: '20px',
  },
  title: {
    marginBottom: '10px',
  },
  section: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-secondary)',
  },
  sectionTitle: {
    marginTop: '0',
    marginBottom: '15px',
    color: 'var(--text-primary)',
  },
  button: {
    padding: '8px 16px',
    marginRight: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    backgroundColor: 'var(--btn-bg)',
    color: 'var(--btn-text)',
  },
  buttonSecondary: {
    padding: '8px 16px',
    marginRight: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  },
  status: {
    padding: '12px',
    marginTop: '10px',
    borderRadius: '4px',
    fontSize: '14px',
  },
  statusLoading: {
    backgroundColor: 'rgba(100, 150, 255, 0.1)',
    color: 'var(--text-primary)',
  },
  statusSuccess: {
    backgroundColor: 'rgba(50, 200, 100, 0.1)',
    color: 'var(--text-primary)',
  },
  statusError: {
    backgroundColor: 'rgba(255, 100, 100, 0.1)',
    color: 'var(--text-primary)',
  },
  list: {
    listStyle: 'none',
    padding: '0',
    marginTop: '10px',
  },
  listItem: {
    padding: '10px',
    marginBottom: '8px',
    borderLeft: '4px solid var(--btn-bg)',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '4px',
  },
  info: {
    padding: '10px',
    marginTop: '10px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace',
  },
  counter: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: 'var(--btn-bg)',
    color: 'var(--btn-text)',
    borderRadius: '4px',
    marginLeft: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
}

function ComponentA() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: (context) => fetchUsers(context, 'Deduplication:ComponentA'),
  })

  return <div>A</div>
}

function ComponentB() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: (context) => fetchUsers(context, 'Deduplication:ComponentB'),
  })

  return <div>B</div>
}

function ComponentC() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: (context) => fetchUsers(context, 'Deduplication:ComponentC'),
  })

  return <div>C</div>
}

// Feature 1: Caching Demo
function CachingDemo() {
  const { data: users, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>🗂️ Caching Demo</h3>
      <p>
        Click "Fetch" multiple times quickly. After the first request, subsequent fetches will use
        cached data (no loading spinner) until the data becomes stale (5 minutes).
      </p>

      <button
        style={styles.button}
        onClick={() => refetch()}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : isFetching ? 'Fetching (from cache)...' : 'Fetch Users'}
      </button>

      {isLoading && <div style={{ ...styles.status, ...styles.statusLoading }}>Loading...</div>}
      {users && (
        <div style={styles.info}>
          <strong>Cached Data (staleTime: 5 minutes):</strong>
          <ul style={styles.list}>
            {users.map(user => (
              <li key={user.id} style={styles.listItem}>
                {user.name} ({user.username}) - {user.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Feature 2: Retry Logic Demo
function RetryDemo() {
  const [userId, setUserId] = useState(1)
  
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    retry: 5, // Retry up to 5 times on failure
    retryDelay: () => 1000,
  })

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>🔄 Retry Logic Demo</h3>
      <p>
        This feature has a 90% failure rate. TanStack Query automatically retries failed requests
        with exponential backoff (1s, 2s, 4s, etc.). Try clicking "Fetch" until it succeeds!
      </p>

      <div>
        <label>User ID: </label>
        <input
          type="number"
          min="1"
          max="5"
          value={userId}
          onChange={e => setUserId(parseInt(e.target.value))}
          style={{ padding: '6px', marginRight: '8px' }}
        />
        <button
          style={styles.button}
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? 'Retrying...' : 'Fetch User'}
        </button>
      </div>

      {isLoading && <div style={{ ...styles.status, ...styles.statusLoading }}>Retrying...</div>}
      {error && (
        <div style={{ ...styles.status, ...styles.statusError }}>
          ❌ Error: {(error as Error).message}
        </div>
      )}
      {user && (
        <div style={{ ...styles.status, ...styles.statusSuccess }}>
          ✅ Success! {user.name} ({user.username}) - {user.email}
        </div>
      )}
    </div>
  )
}

// Feature 3: Staleness & Background Refetching Demo
function StalenessDemo() {
  const [autoRefetch, setAutoRefetch] = useState(true)
  
  const { data: posts, isLoading, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
    staleTime: 3000, // Data is stale after 3 seconds
    refetchInterval: autoRefetch ? 5000 : false, // Refetch every 5 seconds if enabled
  })

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>📊 Staleness & Background Refetching</h3>
      <p>
        Data becomes "stale" after 3 seconds. Enable auto-refetch to see background refetching in action.
      </p>

      <label>
        <input
          type="checkbox"
          checked={autoRefetch}
          onChange={e => setAutoRefetch(e.target.checked)}
        />
        {' '}Auto-refetch every 5 seconds
      </label>

      <div style={{ marginTop: '10px' }}>
        {isLoading && <div style={{ ...styles.status, ...styles.statusLoading }}>Loading posts...</div>}
        {isFetching && !isLoading && (
          <div style={{ ...styles.status, ...styles.statusLoading }}>
            Background refetching in progress...
          </div>
        )}
      </div>

        <p>Title: {posts?.title}</p>
        <p>Description: {posts?.body}</p>
    </div>
  )
}

// Feature 4: Request Deduplication Demo
function DeduplicationDemo() {

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>🚀 Request Deduplication</h3>
      <p>
        Click "Fetch 3 Times" to trigger 3 rapid requests. TanStack Query automatically
        deduplicates them into a single API call! Check the browser's Network tab to verify.
      </p>

        <ComponentA />
        <ComponentB />
        <ComponentC />
      {/* <button
        style={styles.button}
        onClick={handleMultipleFetches}
        disabled={isLoading}
      >
        Fetch 3 Times Rapidly
      </button>

      {isLoading ? (
        <div style={{ ...styles.status, ...styles.statusLoading }}>
          Loading (only 1 API call despite 3 requests)...
        </div>
      ) : (
        <div style={{ ...styles.status, ...styles.statusSuccess }}>
          ✅ Requests attempted: {fetchCount} | Actual API calls: 1 (deduplicated!)
        </div>
      )}

      {users && (
        <div style={styles.info}>
          <strong>Users:</strong>
          <ul style={styles.list}>
            {users.map(user => (
              <li key={user.id} style={styles.listItem}>
                {user.name} ({user.username})
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  )
}

// Feature 5: Optimistic Updates Demo
// function OptimisticUpdatesDemo() {
//   const queryClient = useQueryClient()
//   const [selectedPostId, setSelectedPostId] = useState(1)
//   const [newTitle, setNewTitle] = useState('')

//   const { data: posts, isLoading } = useQuery({
//     queryKey: ['posts-optimistic'],
//     queryFn: fetchPosts,
//   })

//   const updatePostMutation = useMutation({
//     mutationFn: (updates: Partial<Post>) => updatePost(selectedPostId, updates),
//     onMutate: async (newData) => {
//       // Cancel ongoing queries
//       await queryClient.cancelQueries({ queryKey: ['posts-optimistic'] })

//       // Get previous data
//       const previousPosts = queryClient.getQueryData<Post[]>(['posts-optimistic'])

//       // Update cache optimistically
//       queryClient.setQueryData(['posts-optimistic'], (old: Post[]) =>
//         old.map(post =>
//           post.id === selectedPostId
//             ? { ...post, ...newData }
//             : post
//         )
//       )

//       return { previousPosts }
//     },
//     onError: (err, newData, context) => {
//       // Rollback on error
//       if (context?.previousPosts) {
//         queryClient.setQueryData(['posts-optimistic'], context.previousPosts)
//       }
//     },
//     onSuccess: () => {
//       // Revalidate after successful update
//       queryClient.invalidateQueries({ queryKey: ['posts-optimistic'] })
//       setNewTitle('')
//     },
//   })

//   const handleUpdate = () => {
//     if (newTitle.trim()) {
//       updatePostMutation.mutate({ title: newTitle })
//     }
//   }

//   return (
//     <div style={styles.section}>
//       <h3 style={styles.sectionTitle}>⚡ Optimistic Updates</h3>
//       <p>
//         Updates appear immediately in the UI while the request is being sent. If the request fails,
//         the UI automatically rolls back to the previous state. Note: JSONPlaceholder doesn't actually
//         persist changes, but this demonstrates the optimistic update pattern.
//       </p>

//       {isLoading ? (
//         <div style={{ ...styles.status, ...styles.statusLoading }}>Loading posts...</div>
//       ) : posts ? (
//         <div>
//           <div style={{ marginBottom: '15px' }}>
//             <label>Select Post: </label>
//             <select
//               value={selectedPostId}
//               onChange={e => setSelectedPostId(parseInt(e.target.value))}
//               style={{ padding: '6px', marginRight: '8px' }}
//             >
//               {posts.map(post => (
//                 <option key={post.id} value={post.id}>
//                   {post.title}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={{ marginBottom: '15px' }}>
//             <input
//               type="text"
//               placeholder="New title"
//               value={newTitle}
//               onChange={e => setNewTitle(e.target.value)}
//               onKeyPress={e => e.key === 'Enter' && handleUpdate()}
//               style={{ padding: '6px', marginRight: '8px', width: '300px' }}
//             />
//             <button
//               style={styles.button}
//               onClick={handleUpdate}
//               disabled={updatePostMutation.isPending || !newTitle.trim()}
//             >
//               {updatePostMutation.isPending ? 'Updating...' : 'Update Title'}
//             </button>
//           </div>

//           {updatePostMutation.isPending && (
//             <div style={{ ...styles.status, ...styles.statusLoading }}>
//               Updating optimistically...
//             </div>
//           )}
//           {updatePostMutation.isSuccess && (
//             <div style={{ ...styles.status, ...styles.statusSuccess }}>
//               ✅ Update successful! (UI updated immediately, then confirmed by server)
//             </div>
//           )}
//           {updatePostMutation.isError && (
//             <div style={{ ...styles.status, ...styles.statusError }}>
//               ❌ Update failed and was rolled back.
//             </div>
//           )}

//           <div style={styles.info}>
//             <strong>Current Post:</strong>
//             {posts
//               .filter(p => p.id === selectedPostId)
//               .map(post => (
//                 <div key={post.id} style={{ marginTop: '10px' }}>
//                   <strong>{post.title}</strong>
//                   <br />
//                   <small>{post.body}</small>
//                 </div>
//               ))}
//           </div>
//         </div>
//       ) : null}
//     </div>
//   )
// }

export default function TanStackQueryDemo() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚛️ TanStack Query POC</h1>
        <p>Demonstration of caching, retrying, staleness, deduplication, and optimistic updates</p>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--btn-bg)' }}>
          ← Back to Home
        </Link>
      </div>

      <div style={styles.grid}>
        <CachingDemo />
        <RetryDemo />
        <StalenessDemo />
        <DeduplicationDemo />
      </div>

      {/* <OptimisticUpdatesDemo /> */}
    </div>
  )
}
