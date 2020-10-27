import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { List, Avatar } from 'antd';
import 'antd/dist/antd.css';
import { Collapse } from 'antd';
import { Spin } from 'antd';
import { Comment, Tooltip } from 'antd';
import { Layout } from 'antd';
import moment from 'moment';
const { Panel } = Collapse;
const { Header, Footer, Sider, Content } = Layout;

const BASE_URL = `https://hacker-news.firebaseio.com/v0/`

axios.defaults.baseURL = BASE_URL

const TOP_STORIES = `topstories.json`
const STORY_URL = `item/`

function App() {

  const [stories, setStories] = useState([]) //sampleStories
  const [comments, setComments] = useState([]) //sampleComments
  const [loadingStories, setLoadingStories] = useState(true)
  const [loadingComments, setLoadingComments] = useState(true)

  useEffect(() => {
    getTopStories()
  }, [])

  const getTopStories = () => {
    axios.get(`${TOP_STORIES}`).then(res => {
      let topTen = res.data
      topTen.length = 10
      getMetaData(topTen)
    }).catch(err => {
      debugger
    })
  }

  const getStoryDetails = (id) => {
    return axios.get(`${STORY_URL}${id}.json`).then(res => {
      return res.data
    }).catch(err => {
      // debugger
    })
  }

  const getMetaData = async (stories) => {
    let inputStories = []
    for (let index = 0; index < stories.length; index++) {
      const fruit = stories[index]
      const oneStory = await getStoryDetails(fruit)
      inputStories.push(oneStory)
    }
    setStories(inputStories)
    setLoadingStories(false)
  }

  const getComments = (kids) => {
    kids.map(kid => {

    })
  }

  const callback = async (key, value) => {
    setComments([])
    setLoadingComments(true)
    const storyComments = await getStoryDetails(key)
    let { kids } = storyComments ? storyComments : {}
    kids = kids || []
    kids.length = 20
    kids = kids.filter(el => el !== null)
    getTop20Comments(kids)
  }

  const getTop20Comments = async (stories) => {
    let commentsList = []
    for (let index = 0; index < stories.length; index++) {
      const fruit = stories[index]
      const oneStory = await getStoryDetails(fruit)
      commentsList.push(oneStory)
    }
    setComments(commentsList)
    setLoadingComments(false)
  }

  return (
    <div className="App">
      <br></br>
      <h2>Hacker News - Top Stories</h2>
      <hr />
      {loadingStories && <div className="loading"><Spin /> Loading top stories..</div>}
      <Collapse accordion defaultActiveKey={['1']} onChange={callback}>
        {stories && stories.map(story => {
          return (<Panel key={story.id} header={story.title}>
            {loadingComments && <div className="loading"><Spin /> Loading top comments..</div>}
            <List
              className="comment-list"
              header={comments.length > 0 && `${comments.length} comments`}
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={item => (
                <li>
                  <Comment
                    author={item.by}
                    content={item.text}
                  />
                </li>
              )}
            />
          </Panel>)
        })}
      </Collapse>
    </div>
  );
}

export default App;
