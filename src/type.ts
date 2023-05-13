export interface JuejinArticleInfo {
  title: string
  ctime: string
  article_id: string
  digg_count: string
  collect_count: string
}

export interface SegmentfaultArticleInfo {
  title: string
  url: string
  /** created time，equal publish time */
  created: number
  votes: number
}

export interface ZhihuArticleInfo {
  title: string
  url: string
  /** created time，equal publish time */
  created: number
  voteupCount: number
}

export interface YuqueArticleInfo {
  created_at: string
  data: {
    title: string
    likes_count: number
    id: number
  }
}

export interface CommonPost {
  /** 发布时间 */
  publish_time: string | number
  /** 标题 */
  title: string
  /** 链接 */
  link: string
  /** 点赞数 */
  star: number
  /** 收藏数 */
  collect: number | null
}

export type SupportPlatform = 'juejin' | 'zhihu' | 'yuque' | 'segmentfault'

export interface GetPostListProps {
  user_id: string
  plat_form: SupportPlatform
}
