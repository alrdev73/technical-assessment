import Header from './components/Header'
import ClipControl from './components/ClipControl'

function App() {
  return (
    <>
      <Header/>
      <div className='flex flex-col py-2 space-y-2 items-center justify-center'>
        <ClipControl/>
      </div>
    </>
  )
}

export default App
