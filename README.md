# 在 README 中生成不同平台的最近文章，支持掘金、知乎、语雀、思否

## 灵感来源

受到 [KunLunXu-CC/juejin-posts-action](https://github.com/KunLunXu-CC/juejin-posts-action) 的启发，但用了发现只生成了文章链接，不支持点赞数、收藏数、多平台等功能，所以打算自己实现一个。

## 使用方法

1. 在 `README` 中任意位置添加标志位

```markdown
<!-- multi-platform-posts start -->
这里会插入生成的文章列表
<!-- multi-platform-posts end -->
```

2. 设置工作流（[可参照我的](https://github.com/baozouai/baozouai/blob/master/.github/workflows/update_readme.yml))

```yaml
# 工作流名称
name: Update Readme

# 工作流触发时机, see: https://docs.github.com/zh/actions/using-workflows/triggering-a-workflow
# 触发条件修改为: 当 main 分支有 push 操作 || 每天 0 点
on:
  schedule:
    - cron: '30 22 * * *'
  push:
    branches: 
      - master
      - feature/zhihu  
      - feature/yuque  
      - feature/segmentfault  

# 作业, see: https://docs.github.com/zh/actions/using-jobs/using-jobs-in-a-workflow
jobs:

  # 插入掘金列表, 使用 baozouai/multi-platform-posts-action 生成文章列表, see: https://github.com/baozouai/multi-platform-posts-action
  juejin-posts: 
    runs-on: ubuntu-latest    
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Append Juejin Posts List 📚
        uses: baozouai/multi-platform-posts-action@main
        with: 
          user_id: "3526889034488174"
          platform: juejin

      - run: |
          git pull
      - name: Push to GitHub
        uses: EndBug/add-and-commit@v9
        with:
          default_author: github_actions
          message: 'juejin-posts'
  # 成统计图, see: https://github.com/lowlighter/metrics
  github-metrics: 
    runs-on: ubuntu-latest    
    steps:
      - name: metrics-Half-year-calendar
        uses: lowlighter/metrics@latest
        with:
          base: ""
          filename: assets/metrics.plugin.isocalendar.svg
          token: ${{ github.token }}
          plugin_isocalendar: yes
```
