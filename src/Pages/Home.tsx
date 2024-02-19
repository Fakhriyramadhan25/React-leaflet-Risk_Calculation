import { useAppDispatch } from '../redux/hooks'

import { update} from '../redux/counter'


function Home() {
  // The `state` arg is correctly typed as `RootState` already

  const dispatch = useAppDispatch()

  return (
    <div>
      
  </div>
  )
}

export default Home