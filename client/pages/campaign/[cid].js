import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  const { cid } = router.query

  return <p>Campaign ID: {cid}</p>
}

export default Post