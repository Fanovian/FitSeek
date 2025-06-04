<script setup>
import { ref, onMounted } from 'vue'
import errorReport from '@/utils/errorReport.js'
const userInfo = ref({
  tel: '',
  name: '',
  age: '',
  gender: '',
  height: '',
  weight_goal: '',
  password: '123456'
})
const showEditName = ref(false)
const showEditPassword = ref(false)
const showEditProfile = ref(false)
const tempValue = ref('')
const tempname = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const serverStatus = ref('checking') // 'online', 'offline', 'checking'

// 检查服务器状态
async function checkServerStatus() {
  try {
    const response = await uni.request({
      url: 'https://api.fanovian.cc:3000/api/auth/login', 
      method: 'POST',
      data: { type: 0, value: 'test', password: 'test' },
      timeout: 5000
    })
    serverStatus.value = 'online'
    return true
  } catch (error) {
    errorReport(error, 'checkServerStatus', '/pages/user/index')
    console.error('服务器连接失败:', error)
    serverStatus.value = 'offline'
    return false
  }
}

// 获取用户基本信息
async function fetchBasicInfo() {
  const token = uni.getStorageSync('jwtToken')
  if (!token) {
    uni.showToast({ title: '未登录，请先登录', icon: 'none' })
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  try {
    loading.value = true
    const response = await uni.request({
      url: 'https://api.fanovian.cc:3000/api/profile/getBasicInfo',  
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.data && response.data.success) {
      const user = response.data.user
      userInfo.value.tel = user.tel || ''
      userInfo.value.name = user.name || '用户'
    } else {
      uni.showToast({ title: response.data?.message || '获取用户基本信息失败', icon: 'none' })
      if (response.data?.message?.includes('Token') || response.statusCode === 401) {
        uni.reLaunch({ url: '/pages/login/index' })
      }
    }
  } catch (error) {
    errorReport(error, 'fetchBasicInfo', '/pages/user/index')
    console.error('获取用户基本信息失败:', error)
    const loginInfo = uni.getStorageSync('userInfo') || {}
    if (loginInfo.tel || loginInfo.name) {
      userInfo.value.tel = loginInfo.tel || ''
      userInfo.value.name = loginInfo.name || '用户'
      uni.showToast({ title: '服务器连接失败，显示本地数据', icon: 'none' })
    } else {
      uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' })
    }
  }
}

// 获取用户详细资料
async function fetchUserProfile() {
  const token = uni.getStorageSync('jwtToken')
  if (!token) {
    return
  }
  try {
    const response = await uni.request({
      url: 'https://api.fanovian.cc:3000/api/profile/get',  
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.data && response.data.success) {
      const profile = response.data.profile
      userInfo.value = {
        ...userInfo.value, 
        age: profile.age.toString(),
        gender: profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他',
        height: profile.height ? profile.height.toString() : '',
        weight_goal: profile.weight_goal ? profile.weight_goal.toString() : '',
        password: '********'
      }
    } else {
      errorReport(new Error('API返回失败'), 'fetchUserProfile', '/pages/user/index')
      console.error('获取详细资料API返回失败:', response.data)
    }
  } catch (error) {
    errorReport(error, 'fetchUserProfile', '/pages/user/index')
    console.error('获取用户详细资料失败:', error)
    const localProfile = uni.getStorageSync('localProfile') || {}
    if (Object.keys(localProfile).length > 0) {
      userInfo.value = {
        ...userInfo.value,
        age: localProfile.age || '',
        gender: localProfile.gender || '',
        height: localProfile.height || '',
        weight_goal: localProfile.weight_goal || '',
        password: '********'
      }
      uni.showToast({ title: '服务器连接失败，显示本地数据', icon: 'none' })
    }
  } finally {
    loading.value = false
  }
}

// 更新用户资料到服务器
async function updateUserProfile(field, value) {
  const token = uni.getStorageSync('jwtToken')
  if (!token) {
    uni.showToast({ title: '未登录，请先登录', icon: 'none' })
    uni.reLaunch({ url: '/pages/login/index' })
    return false
  }
  const updateData = { ...userInfo.value }
  if (field === 'age') updateData.age = parseInt(value) || null
  if (field === 'gender') updateData.gender = value === '男' ? 'male' : value === '女' ? 'female' : 'other'
  if (field === 'height') updateData.height = parseInt(value) || null  
  if (field === 'weightGoal') updateData.weight_goal = parseFloat(value) || null
  try {
    loading.value = true
    const response = await uni.request({
      url: 'https://api.fanovian.cc:3000/api/profile/update',
      method: 'POST',
      data: updateData,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })    
    if (response.data && response.data.success) {
      return true
    } else {
      errorReport(new Error('API返回失败'), 'updateUserProfile', '/pages/user/index')
      uni.showToast({ title: response.data?.message || '更新失败', icon: 'none' })
      return false
    }
  } catch (error) {
    errorReport(error, 'updateUserProfile', '/pages/user/index')
    console.error('更新用户资料失败:', error)
    const localProfile = uni.getStorageSync('localProfile') || {}
    return true
  } finally {
    loading.value = false
  }
}

function openEdit(field) {
  showEditProfile.value = field
  if (field === 'weightGoal') {
    tempValue.value = userInfo.value.weight_goal
  } else {
    tempValue.value = userInfo.value[field]
  }
}

async function saveEdit(field) {
  if (!tempValue.value) {
    uni.showToast({ title: '请输入有效值', icon: 'none' })
    return
  }
  const success = await updateUserProfile(field, tempValue.value)
  if (success) {
    if (field === 'weightGoal') {
      userInfo.value.weight_goal = tempValue.value
    } else {
      userInfo.value[field] = tempValue.value
    }
    showEditProfile.value = false
  }
}

function openEditName() {
  showEditName.value = true
  tempname.value = userInfo.value.name
}

async function saveEditName() {
  if (!tempname.value.trim()) {
    uni.showToast({ title: '请输入有效的用户名', icon: 'none' })
    return
  }
  const token = uni.getStorageSync('jwtToken')
  if (!token) {
    uni.showToast({ title: '未登录，请先登录', icon: 'none' })
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  try {
    loading.value = true
    const response = await uni.request({
      url: 'https://api.fanovian.cc:3000/api/profile/updateUsername', 
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: {
        newName: tempname.value.trim()
      }
    })
    if (response.data && response.data.success) {
      userInfo.value.name = tempname.value.trim()
      showEditName.value = false
      uni.showToast({ title: '用户名修改成功', icon: 'success' })
      const loginInfo = uni.getStorageSync('userInfo') || {}
      loginInfo.name = tempname.value.trim()
      uni.setStorageSync('userInfo', loginInfo)
    } else {
      uni.showToast({ title: response.data?.message || '用户名修改失败', icon: 'none' })
    }
  } catch (error) {
    console.error('修改用户名失败:', error)
    uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function openEditPassword() {
  showEditPassword.value = true
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

async function saveEditPassword() {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    uni.showToast({ title: '请填写完整的密码信息', icon: 'none' })
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    uni.showToast({ title: '两次输入的新密码不一致', icon: 'none' })
    return
  }
  if (newPassword.value.length < 6) {
    uni.showToast({ title: '新密码至少需要6位字符', icon: 'none' })
    return
  }
  const token = uni.getStorageSync('jwtToken')
  if (!token) {
    uni.showToast({ title: '未登录，请先登录', icon: 'none' })
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  try {
    loading.value = true
    const response = await uni.request({
      url: 'https://api.fanovian.cc:3000/api/profile/updatePassword', 
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      }
    })
    if (response.data && response.data.success) {
      showEditPassword.value = false
      uni.showToast({ title: '密码修改成功，请重新登录', icon: 'success' })
      setTimeout(() => {
        uni.removeStorageSync('jwtToken')
        uni.removeStorageSync('userInfo')
        uni.reLaunch({ url: '/pages/login/index' })
      }, 1500)
    } else {
      uni.showToast({ title: response.data?.message || '密码修改失败', icon: 'none' })
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function logout() {
  uni.removeStorageSync('jwtToken')
  uni.removeStorageSync('userInfo')
  uni.reLaunch({ url: '/pages/login/index' })
}

onMounted(async () => {
  try {
    await checkServerStatus()
    await fetchBasicInfo()
    await fetchUserProfile()
  } catch (error) {
    errorReport(error, 'onMounted', '/pages/user/index')
  }
})
</script>

<template>
  <view class="container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else>
      <!-- 服务器状态指示器 -->
      <view class="server-status" :class="serverStatus">
        <text v-if="serverStatus === 'online'" class="status-text">🟢 服务器在线</text>
        <text v-else-if="serverStatus === 'offline'" class="status-text">🔴 服务器离线，使用本地数据</text>
        <text v-else class="status-text">🟡 检查服务器状态...</text>
      </view>

      <view class="user-info">
        <text class="username">{{ userInfo.name }}</text>
        <button class="edit-btn edit-btn-inline" @click="openEdit('name')">修改</button>
      </view>

      <view class="profile-list">
        <view class="profile-item">
          <view class="item-left">
            <text class="label">手机号</text>
          </view>
          <view class="item-right">
            <text class="value">{{ userInfo.tel || '未设置' }}</text>
          </view>
        </view>
        <view class="profile-item">
          <view class="item-left">
            <text class="label">年龄</text>
            <button class="edit-btn" @click="openEdit('age')">修改</button>
          </view>
          <view class="item-right">
            <text class="value">{{ userInfo.age || '未设置' }}</text>
          </view>
        </view>
        <view class="profile-item">
          <view class="item-left">
            <text class="label">性别</text>
            <button class="edit-btn" @click="openEdit('gender')">修改</button>
          </view>
          <view class="item-right">
            <text class="value">{{ userInfo.gender || '未设置' }}</text>
          </view>
        </view>
        <view class="profile-item">
          <view class="item-left">
            <text class="label">身高(cm)</text>
            <button class="edit-btn" @click="openEdit('height')">修改</button>
          </view>
          <view class="item-right">
            <text class="value">{{ userInfo.height || '未设置' }}</text>
          </view>
        </view>
        <view class="profile-item">
          <view class="item-left">
            <text class="label">体重目标(kg)</text>
            <button class="edit-btn" @click="openEdit('weightGoal')">修改</button>
          </view>
          <view class="item-right">
            <text class="value">{{ userInfo.weight_goal || '未设置' }}</text>
          </view>
        </view>
        <view class="profile-item">
          <view class="item-left">
            <text class="label">密码</text>
            <button class="edit-btn" @click="openEditPassword">修改</button>
          </view>
          <view class="item-right">
            <text class="value">********</text>
          </view>
        </view>
      </view>

      <!-- 修改用户名弹窗 -->
      <uni-popup v-model="showEditName" type="dialog">
        <view class="popup-content" v-if="showEditName">
          <text class="popup-title">修改用户名</text>
          <input type="text" v-model="tempname" placeholder="请输入新用户名" class="popup-input" />
          <view class="popup-buttons">
            <button class="cancel-btn" @click="showEditName = false">取消</button>
            <button class="save-btn" @click="saveEditName">保存</button>
          </view>
        </view>
      </uni-popup> 

      <!-- 修改资料弹窗 -->
      <uni-popup v-model="showEditProfile" type="dialog">
        <view class="popup-content" v-if="showEditProfile === 'age'">
          <text class="popup-title">修改年龄</text>
          <input v-model="tempValue" type="number" placeholder="请输入年龄" class="popup-input" />
          <view class="popup-buttons">
            <button class="cancel-btn" @click="showEditProfile = false">取消</button>
            <button class="save-btn" @click="saveEdit('age')">保存</button>
          </view>
        </view>
        <view class="popup-content" v-if="showEditProfile === 'gender'">
          <text class="popup-title">选择性别</text>
          <picker :range="['男','女']" :value="['男','女'].indexOf(tempValue)" @change="e => tempValue = ['男','女'][e.detail.value]">
            <view class="picker-value">{{ tempValue || '请选择性别' }}</view>
          </picker>
          <view class="popup-buttons">
            <button class="cancel-btn" @click="showEditProfile = false">取消</button>
            <button class="save-btn" @click="saveEdit('gender')">保存</button>
          </view>
        </view>
        <view class="popup-content" v-if="showEditProfile === 'height'">
          <text class="popup-title">修改身高</text>
          <input v-model="tempValue" type="number" placeholder="请输入身高(cm)" class="popup-input" />
          <view class="popup-buttons">
            <button class="cancel-btn" @click="showEditProfile = false">取消</button>
            <button class="save-btn" @click="saveEdit('height')">保存</button>
          </view>
        </view>
        <view class="popup-content" v-if="showEditProfile === 'weightGoal'">
          <text class="popup-title">修改体重目标</text>
          <input v-model="tempValue" type="number" placeholder="请输入体重目标(kg)" class="popup-input" />
          <view class="popup-buttons">
            <button class="cancel-btn" @click="showEditProfile = false">取消</button>
            <button class="save-btn" @click="saveEdit('weightGoal')">保存</button>
          </view>
        </view>
      </uni-popup>

      <!-- 修改密码弹窗 -->
      <uni-popup v-model="showEditPassword" type="dialog">
        <view class="popup-content" v-if="showEditPassword">
          <text class="popup-title">修改密码</text>
          <input type="password" v-model="oldPassword" placeholder="请输入当前密码" class="popup-input" />
          <input type="password" v-model="newPassword" placeholder="请输入新密码" class="popup-input" />
          <input type="password" v-model="confirmPassword" placeholder="请确认新密码" class="popup-input" />
          <view class="popup-buttons">
            <button class="cancel-btn" @click="showEditPassword = false">取消</button>
            <button class="save-btn" @click="saveEditPassword">保存</button>
          </view>
        </view>
      </uni-popup>
    </view>

    <button class="logout-btn" @click="logout" style="margin-top: 10rpx; margin-bottom: 40rpx;">退出登录</button>

    <view style="flex:1"></view>
  </view>
</template>