/* eslint-disable @typescript-eslint/no-unsafe-argument */
import superagent from 'superagent'
import { load } from 'cheerio'
import type { CommonPost, GetPostListProps, JuejinArticleInfo, SegmentfaultArticleInfo, YuqueArticleInfo, ZhihuArticleInfo } from '../type'

async function getJuejinList(user_id: string) {
  const res = await superagent
    .post('https://api.juejin.cn/content_api/v1/article/query_list')
    .send({
      user_id,
      sort_type: 2,
      cursor: '0',
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const postArgs: CommonPost[] = res.body.data.map(({ article_info }: { article_info: JuejinArticleInfo }) => {
    const { title, ctime, article_id, digg_count, collect_count } = article_info
    return {
      title,
      publish_time: ctime,
      link: `https://juejin.cn/post/${article_id}`,
      star: Number(digg_count),
      collect: Number(collect_count),
    }
  })
  return postArgs
}

async function getSegmentfaultList(user_id: string) {
  const res = await superagent
    .get(`https://segmentfault.com/gateway/homepage/${user_id}/articles`)
    .send({
      size: 10,
      sort: 'newest',
    })
  const rows = res.body.rows as SegmentfaultArticleInfo[]
  const postArgs: CommonPost[] = rows.map((row) => {
    const { title, url, created, votes } = row
    return {
      title,
      publish_time: created,
      link: `https://segmentfault.com/${url}`,
      star: votes,
      collect: null,
    }
  })
  return postArgs
}

async function getZhihuList(user_id: string) {
  const res = await superagent
    .get(`https://www.zhihu.com/people/${user_id}/posts`)
  const $ = load(res.text)
  const js = $('#js-initialData').text()
  const articles: ZhihuArticleInfo[] = Object.values(JSON.parse(js).initialState.entities.articles)
  articles.sort((a, b) => b.created - a.created)
  const postArgs: CommonPost[] = articles.map((article) => {
    const { title, url, created, voteupCount } = article

    return {
      title,
      link: url,
      publish_time: created,
      star: voteupCount,
      collect: null,
    }
  })

  return postArgs
}

async function getYuqueList(userName: string) {
  const res = await superagent
    .get(`https://www.yuque.com/${userName}`)

  const argsStr = res.text.match(/window\.appData = JSON\.parse\(decodeURIComponent\("(.+?)"\)\)/)![1]
  const userId = JSON.parse(decodeURIComponent(argsStr)).user.id as string
  const res2 = await superagent.get(`https://www.yuque.com/api/events/public?id=${userId}&limit=10&offset=0`)

  const yuqueArticleInfos = res2.body.data as YuqueArticleInfo[]

  const postArgs: CommonPost[] = yuqueArticleInfos.map((yuqueArticleInfo) => {
    const { created_at, data } = yuqueArticleInfo
    const { id, likes_count, title } = data
    const timestamp = Date.parse(created_at)
    const seconds = Math.floor(timestamp / 1000)

    return {
      title,
      link: `https://www.yuque.com/go/doc/${id}`,
      publish_time: seconds,
      star: likes_count,
      collect: null,
    }
  })

  return postArgs
}

function getPostList({ user_id, plat_form }: GetPostListProps) {
  switch (plat_form) {
    case 'juejin':
      return getJuejinList(user_id)
    case 'segmentfault':
      return getSegmentfaultList(user_id)
    case 'zhihu':
      return getZhihuList(user_id)
    case 'yuque':
      return getYuqueList(user_id)
    default:
      break
  }
}

export default getPostList
