import fs from 'node:fs'
import * as core from '@actions/core'
import type { SupportPlatform } from './type'
import getPostList from './util/get_list'
import { getTimeDiffString } from './util/time'

const SUPPORT_PLAT_FORM = [
  /** 掘金 */
  'juejin',
  /** 思否 */
  'segmentfault',
  /** 知乎 */
  'zhihu',
  /** 语雀 */
  'yuque',
]

async function main(): Promise<void> {
  // 读取参数: 用户 ID
  const USER_ID = core.getInput('user_id')
  // 读取参数: 平台 PLAT_FORM
  const PLAT_FORM = (core.getInput('plat_form')) as SupportPlatform
  if (!SUPPORT_PLAT_FORM.includes(PLAT_FORM))
    return core.setFailed(`平台: ${PLAT_FORM}暂不支持，请提issue`)
  try {
    core.info('1.获取页面数据...')
    const commonPosts = await getPostList({
      user_id: USER_ID,
      plat_form: PLAT_FORM,
    })!

    core.info('2. 生成 html中...')
    const reduceText = commonPosts.reduce<string>((total, item) => {
      const { title, publish_time, link, star, collect } = item
      const time = getTimeDiffString(publish_time)
      return `${total}\n<li>[${time} <img src="./assets/star.svg" width='14px'/>：${star}  ${collect === null ? '' : `<img src="./assets/collect.svg"  width='20px'/>：${collect}`}]
      <a href="${link}" target="_blank">${title}</a>
      </li>`
    }, '')
    const appendHtml = `\n<ul>${reduceText}\n</ul>\n`

    core.info(`3. 读取 README, 在 <!-- multi-platform-posts start --> 和 <!-- multi-platform-posts end --> 中间插入生成的 html: \n ${appendHtml}`)

    const README_PATH = './README.md'
    const res = fs.readFileSync(README_PATH, 'utf-8')
      .replace(/(?<=<!-- multi-platform-posts start -->)[.\s\S]*?(?=<!-- multi-platform-posts end -->)/, `\n<ul>${appendHtml}\n</ul>\n`)

    core.info('4. 修改 README ...')
    fs.writeFileSync(README_PATH, res)

    core.info(`5. 修改结果: ${res}`)
  }
  catch (error) {
    core.setFailed(error as Error)
  }
}

main()
