import React from 'react'
import { ChatEngineWrapper, ChatSocket, ChatFeed } from 'react-chat-engine'



const ChatsPage = (props) => {
  return (

    <ChatEngineWrapper>
        <ChatSocket
        projectID='dafad71c-059d-4a41-a77e-76d6e92015f9'
        chatID='184591'
        senderUsername={props.user.username} // adam
        chatAccessKey='ca-61b4702d-4774-4d4c-b3bc-0a3de20c80af'
        />
      <ChatFeed className="ChatFeed" activeChat='184591' /> 
      </ChatEngineWrapper>
      
  )
}

export default ChatsPage;