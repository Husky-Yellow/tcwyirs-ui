<template>
  <div>
    <div class="mb-20px flex items-center justify-between">
      <h3 class="text-16px text-#1a1a1a font-600">评论</h3>
      <div class="flex items-end font-['PingFang_SC']">
        <span class="text-18px text-black/45 leading-none">评分：</span>
        <CountTo
          class="text-24px text-#1677FF font-medium leading-none"
          :start-val="0"
          :end-val="overallScore"
          :duration="2600"
        />
      </div>
    </div>

    <!-- 评论输入 -->
    <div v-if="showInput" class="flex gap-12px">
      <el-avatar :size="40" class="flex-shrink-0">
        <el-icon :size="20"><User /></el-icon>
      </el-avatar>
      <div class="flex-1">
        <el-input
          v-model="commentText"
          type="textarea"
          :rows="4"
          placeholder="请输入评论"
          class="mb-12px"
        />
        <el-button type="primary" @click="handlePublish">发 布</el-button>
      </div>
    </div>

    <div class="mb-40px mt-60px h-1px bg-black/6" ></div>

    <!-- 评论列表 -->
    <div class="space-y-16px">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="border border-#F0EEF3 rounded-6px border-solid p-20px"
      >
        <!-- 主评论 -->
        <div class="relative flex gap-12px">
          <el-avatar :size="40" class="flex-shrink-0">
            <el-icon :size="20"><User /></el-icon>
          </el-avatar>
          <div class="min-w-0 flex-1">
            <div class="mb-8px flex items-center gap-8px">
              <span class="text-14px text-#333 font-500">{{ comment.userName }}</span>
              <span class="text-12px text-#999">{{ comment.time }}</span>
            </div>
            <p class="mb-12px text-14px text-#333 leading-1.8">{{ comment.content }}</p>
            <div
              class="cursor-pointer text-13px text-#999 transition-colors hover:text-#409eff"
              @click="handleReply(comment)"
            >
              回复
            </div>

            <!-- 子评论区域 -->
            <div
              v-if="comment.replies?.length && comment.showReplies"
              class="mt-16px"
            >
              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="mb-12px flex gap-12px py-12px last:mb-0"
              >
                <el-avatar :size="32" class="flex-shrink-0">
                  <el-icon :size="16"><User /></el-icon>
                </el-avatar>
                <div class="min-w-0 flex-1">
                  <div class="mb-8px flex items-center gap-8px">
                    <span class="text-13px text-#333 font-500">{{ reply.userName }}</span>
                    <span class="text-12px text-#999">{{ reply.time }}</span>
                  </div>
                  <p class="mb-8px text-13px text-#333 leading-1.6">{{ reply.content }}</p>
                  <div class="cursor-pointer text-12px text-#999 transition-colors hover:text-#409eff">
                    我回复{{ reply.userName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 右上角评分 -->
          <CountTo
            class="absolute right-0 top-0 text-20px font-semibold"
            :class="getScoreColor(comment.score)"
            :start-val="0"
            :end-val="comment.score"
            :duration="2600"
          />
          <!-- 展开/收起按钮 -->
          <div
            v-if="comment.replies?.length"
            class="absolute bottom-0 right-0 cursor-pointer text-12px text-#165DFF"
            @click="comment.showReplies = !comment.showReplies"
          >
            {{ comment.showReplies ? '收起评论' : `(${comment.replies.length}) 展开评论` }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User } from '@element-plus/icons-vue'

defineOptions({ name: 'CommentList' })

interface Reply {
  id: string
  userName: string
  time: string
  content: string
}

interface Comment {
  id: string
  userName: string
  time: string
  content: string
  score: number
  showReplies?: boolean
  replies?: Reply[]
}

interface Props {
  comments: Comment[]
  overallScore?: number
  showInput?: boolean
}

withDefaults(defineProps<Props>(), {
  overallScore: 0,
  showInput: true
})

interface Emits {
  (e: 'publish', content: string): void
  (e: 'reply', comment: Comment): void
}

const emit = defineEmits<Emits>()

const commentText = ref('')

// 根据评分返回颜色类
const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-#409eff' // 蓝色 - 优秀
  if (score >= 80) return 'text-#67c23a' // 绿色 - 良好
  if (score >= 60) return 'text-#e6a23c' // 橙色 - 一般
  return 'text-#f56c6c' // 红色 - 较差
}

const handlePublish = () => {
  if (commentText.value.trim()) {
    emit('publish', commentText.value)
    commentText.value = ''
  }
}

const handleReply = (comment: Comment) => {
  emit('reply', comment)
}
</script>
