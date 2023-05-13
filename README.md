# 在 README 中生成不同平台的最近文章，支持掘金、知乎、语雀、思否


## 使用方法

1. 在 `README` 中任意位置添加标志位

```markdown
<!-- multi-platform-posts start -->
这里会插入生成的文章列表
<!-- multi-platform-posts end -->
```

2. 设置工作流

```yaml
jobs:
  multi-platform-posts:
    runs-on: ubuntu-latest
    steps:
      # 使用 actions/checkout 拉取仓库, see: https://github.com/actions/checkout
      - name: Checkout
        uses: actions/checkout@v3

      # 使用 baozouai/multi-platform-posts-action 生成文章列表,
      # see: https://github.com/baozouai/multi-platform-posts-action
      - name: Append multi-platform-posts Posts List 📚
        uses: baozouai/multi-platform-posts-action@main
        with:
          user_id: '4459274891717223' # add your userid
          platform: juejin # juejin | zhihu | yuque | segmentfault
      - run: |
          git pull
      - name: Push to GitHub
        uses: EndBug/add-and-commit@v9
        with:
          branch: main
          default_author: github_actions
          message: juejin-posts # or yuque-posts; zhihu-posts; segmentfault-posts
```
