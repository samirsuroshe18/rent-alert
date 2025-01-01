import React from 'react'

const SnackBar = ({type, message}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
        <Alert variant={type === 'error' ? 'destructive' : 'default'} className="bg-green-400">
        <AlertDescription>
            {message}
        </AlertDescription>
        </Alert>
    </div>
  )
}

export default SnackBar
