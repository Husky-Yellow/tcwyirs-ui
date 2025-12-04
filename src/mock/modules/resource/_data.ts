import { Random } from '../../utils'
import type { ResourceInfoVO } from '@/api/resource/info'
import type { ResourceTagVO } from '@/api/resource/tag'
import type { ResourceUsageVO } from '@/api/resource/usage'
import type { CollectRecordVO } from '@/api/resource/collect'
import type { BrowseRecordVO } from '@/api/resource/browse'
import type { ScoreConfigVO } from '@/api/resource/scoreConfig'
import type { ScoreTagVO } from '@/api/resource/scoreTag'
import type { ResourceEvaluateVO, ResourceEvaluateReplyVO } from '@/api/resource/evaluate'
import type { ResourceApplyVO } from '@/api/resource/apply'
import type { ProjectVO, ProjectMemberVO } from '@/api/resource/project'
import type { FeedbackVO, FeedbackReplyVO } from '@/api/resource/feedback'
import type { DashboardDataVO, ResourceUsageStatistics } from '@/api/resource/statistics'

const counters = {
  resourceInfo: 100,
  tag: 200,
  userTag: 210,
  scoreTag: 300,
  scoreConfig: 400,
  project: 500,
  projectMember: 510,
  apply: 600,
  usage: 700,
  collect: 800,
  browse: 900,
  feedback: 1000,
  feedbackReply: 1020,
  evaluate: 1100,
  evalReply: 1110
}
export const nextId = (k: keyof typeof counters) => ++counters[k]

export const db = {
  resourceInfos: [] as ResourceInfoVO[],
  tags: [] as ResourceTagVO[],
  userTags: [] as ResourceTagVO[],
  scoreTags: [] as ScoreTagVO[],
  scoreConfigs: [] as ScoreConfigVO[],
  projects: [] as ProjectVO[],
  projectMembers: [] as ProjectMemberVO[],
  applies: [] as ResourceApplyVO[],
  usages: [] as ResourceUsageVO[],
  collects: [] as CollectRecordVO[],
  browses: [] as BrowseRecordVO[],
  feedbacks: [] as FeedbackVO[],
  evaluates: [] as ResourceEvaluateVO[]
}

export function paginate<T>(arr: T[], pageNo: number, pageSize: number) {
  const start = (pageNo - 1) * pageSize
  const end = start + pageSize
  return { list: arr.slice(start, end), total: arr.length }
}

export function calcDashboard(): DashboardDataVO {
  const usageStats: ResourceUsageStatistics = {
    totalCount: db.resourceInfos.length,
    dataCount: db.resourceInfos.filter((r) => r.type === 1).length,
    applicationCount: db.resourceInfos.filter((r) => r.type === 2).length,
    componentCount: db.resourceInfos.filter((r) => r.type === 3).length,
    activeCount: db.usages.filter((u) => u.status === 1).length,
    stoppedCount: db.usages.filter((u) => u.status === 0).length
  }
  return {
    myApplyCount: db.applies.length,
    pendingApprovalCount: db.applies.filter((a) => a.status === 0).length,
    myPublishedCount: db.resourceInfos.filter((r) => r.status === 2).length,
    pendingPublishCount: db.resourceInfos.filter((r) => r.status === 1).length,
    feedbackCount: db.feedbacks.length,
    pendingFeedbackCount: db.feedbacks.filter((f) => f.status === 0 || f.status === 1).length,
    usageStatistics: usageStats,
    browseCount: db.browses.length,
    collectCount: db.collects.length,
    messageCount: 3
  }
}

// seed data
(function seed() {
  // tags
  db.tags.push(
    { id: nextId('tag'), name: 'AI', color: '#1677ff', icon: 'i-carbon-ai', type: 0, sort: 1, createTime: new Date() as any },
    { id: nextId('tag'), name: 'Data', color: '#13c2c2', icon: 'i-carbon-data-structured', type: 0, sort: 2, createTime: new Date() as any },
    { id: nextId('tag'), name: 'App', color: '#fa541c', icon: 'i-carbon-application', type: 0, sort: 3, createTime: new Date() as any }
  )
  db.userTags.push(
    { id: nextId('userTag'), name: 'Hot', color: '#faad14', type: 1, sort: 1, createTime: new Date() as any }
  )

  // score tags
  db.scoreTags.push(
    { id: nextId('scoreTag'), name: 'Easy To Use', description: 'Simple and friendly', score: 10, status: 1, sort: 1, createTime: new Date() as any },
    { id: nextId('scoreTag'), name: 'Stable', description: 'Reliable', score: 8, status: 1, sort: 2, createTime: new Date() as any },
    { id: nextId('scoreTag'), name: 'Fast', description: 'High performance', score: 9, status: 1, sort: 3, createTime: new Date() as any }
  )

  // score configs
  db.scoreConfigs.push(
    { id: nextId('scoreConfig'), name: 'Usability', item: 'EaseOfUse', weight: 0.4, maxScore: 10, status: 1, sort: 1, createTime: new Date() as any },
    { id: nextId('scoreConfig'), name: 'Performance', item: 'Speed', weight: 0.3, maxScore: 10, status: 1, sort: 2, createTime: new Date() as any },
    { id: nextId('scoreConfig'), name: 'Stability', item: 'Reliability', weight: 0.3, maxScore: 10, status: 1, sort: 3, createTime: new Date() as any }
  )

  // projects
  db.projects.push(
    { id: nextId('project'), name: 'Smart City', description: 'Urban data integration', leaderId: 1, leaderName: 'Admin', startTime: new Date() as any, status: 1, createTime: new Date() as any },
    { id: nextId('project'), name: 'IoT Platform', description: 'Device access platform', leaderId: 2, leaderName: 'Test', startTime: new Date() as any, status: 1, createTime: new Date() as any }
  )
  db.projectMembers.push(
    { id: nextId('projectMember'), projectId: db.projects[0].id!, userId: 1, userName: 'Admin', role: 'Owner', createTime: new Date() as any },
    { id: nextId('projectMember'), projectId: db.projects[0].id!, userId: 2, userName: 'Test', role: 'Member', createTime: new Date() as any }
  )

  // resources
  const types = [1, 2, 3] as const
  for (let i = 0; i < 12; i++) {
    db.resourceInfos.push({
      id: nextId('resourceInfo'),
      name: `Resource_${i + 1}`,
      type: types[i % types.length] as any,
      description: `Sample resource ${i + 1}`,
      icon: '',
      status: [0, 1, 2, 3][i % 4],
      tags: [db.tags[i % db.tags.length].id!],
      extInfo: JSON.stringify({ version: '1.0.' + i }),
      creator: i % 2 === 0 ? 'Admin' : 'Test',
      createTime: new Date() as any,
      updateTime: new Date() as any
    })
  }

  // applies
  for (let i = 0; i < 8; i++) {
    db.applies.push({
      id: nextId('apply'),
      resourceId: db.resourceInfos[i].id!,
      resourceName: db.resourceInfos[i].name,
      reason: 'Need access',
      projectId: db.projects[0].id!,
      projectName: db.projects[0].name,
      duration: 30,
      status: i % 3, // 0 pending 1 approved 2 rejected
      approver: 'Admin',
      applicant: 'Test',
      createTime: new Date() as any
    })
  }

  // usages
  for (let i = 0; i < 10; i++) {
    db.usages.push({
      id: nextId('usage'),
      resourceId: db.resourceInfos[i].id!,
      resourceName: db.resourceInfos[i].name,
      userId: i + 1,
      userName: i % 2 === 0 ? 'Admin' : 'Test',
      projectId: db.projects[0].id!,
      projectName: db.projects[0].name,
      status: i % 2, // 0 stopped 1 active
      startTime: new Date() as any,
      endTime: undefined,
      expireTime: undefined,
      createTime: new Date() as any
    })
  }

  // collects
  for (let i = 0; i < 6; i++) {
    db.collects.push({
      id: nextId('collect'),
      resourceId: db.resourceInfos[i].id!,
      resourceName: db.resourceInfos[i].name,
      resourceType: db.resourceInfos[i].type as any,
      resourceIcon: '',
      createTime: new Date() as any
    })
  }

  // browses
  for (let i = 0; i < 20; i++) {
    db.browses.push({
      id: nextId('browse'),
      resourceId: db.resourceInfos[i % db.resourceInfos.length].id!,
      resourceName: db.resourceInfos[i % db.resourceInfos.length].name,
      resourceType: db.resourceInfos[i % db.resourceInfos.length].type as any,
      resourceIcon: '',
      duration: Random.integer(3, 600),
      createTime: new Date() as any
    })
  }

  // feedbacks
  for (let i = 0; i < 5; i++) {
    const fbId = nextId('feedback')
    const replies: FeedbackReplyVO[] = [
      { id: nextId('feedbackReply'), feedbackId: fbId, content: 'Noted', replier: 'Admin', replierId: 1, createTime: new Date() as any }
    ]
    db.feedbacks.push({
      id: fbId,
      title: `Feedback ${i + 1}`,
      content: 'Some issue or suggestion',
      type: (i % 3) + 1,
      resourceId: db.resourceInfos[i].id!,
      resourceName: db.resourceInfos[i].name,
      status: i % 3, // 0 pending 1 processing 2 resolved
      handler: 'Admin',
      handlerId: 1,
      submitter: 'Test',
      submitterId: 2,
      replies,
      createTime: new Date() as any,
      updateTime: new Date() as any
    })
  }

  // evaluates
  for (let i = 0; i < 6; i++) {
    const eid = nextId('evaluate')
    const evalReplies: ResourceEvaluateReplyVO[] = [
      { id: nextId('evalReply'), evaluateId: eid, content: 'Thanks', replier: 'Admin', replierId: 1, createTime: new Date() as any }
    ]
    db.evaluates.push({
      id: eid,
      resourceId: db.resourceInfos[i].id!,
      resourceName: db.resourceInfos[i].name,
      rating: (i % 5) + 1,
      comment: 'Great resource',
      tagIds: db.scoreTags.filter((_, idx) => idx <= i % 3).map((t) => t.id!) as any,
      evaluator: 'Test',
      evaluatorId: 2,
      replies: evalReplies,
      createTime: new Date() as any
    })
  }
})()
