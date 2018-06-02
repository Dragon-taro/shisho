import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SearchZone from './SearchZone'
import MessageForm from './MessageForm'
import {If} from './If'

function getParams() {
  var arg = new Object;
  var pair = location.search.substring(1).split('&');
  for(var i = 0; pair[i]; i++) {
      var kv = pair[i].split('=');
      arg[kv[0]] = decodeURI(kv[1]);
  }
  return arg
}

class Message extends React.Component {
  constructor() {
    super()
    this.state={
      searchParams: getParams(),
      follows: [],
    }
  }

  componentDidMount() {
    this.loadData('GET')
  }

  loadData(type, key_value=null) {
    console.log(key_value);
    const url = Routes.messages_path({opponent_user: gon.opponent_user})
    $.ajax({
      url      : url,
      dataType : 'json',
      type     : type,
      data     : key_value,
      success: (data) => {
        this.setState(data)
      },
      error: (xhr, status, err) => {
        console.error(url, status, err.toString());
      },
    })
  }

  handleSubmit(key_value) {
    this.loadData('POST', key_value)
  }

  render() {
    const userNode = this.state.follows.map(follow => {
      return (
        <Tab key={follow.follow.id}>
          <div>{follow.opponent_user.name}</div>
        </Tab>
      )
    })

    const messageNode = this.state.follows.map(follow => {
      const messageNode = follow.messages.map(message => {
        return <li key={message.id}>{message.content}</li>
      })
      return (
        <TabPanel key={follow.follow.id}>
          <ul>{messageNode}</ul>
          <MessageForm handleSubmit={this.handleSubmit.bind(this)} {...follow.follow} />
        </TabPanel>
      )
    })

    return (
       <div>
         <Tabs>
           <TabList>
             {userNode}
           </TabList>
           {messageNode}
         </Tabs>
       </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Message />,
    document.getElementById("Message"),
  )
})