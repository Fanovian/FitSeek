<script setup>
import { ref, onMounted } from 'vue'

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
    console.error('服务器连接失败:', error)
    serverStatus.value = 'offline'
    return false
  }
}

// 获取用户基本信息
async function fetchBasicInfo() {
  const token = uni.getStorageSync('jwtToken')
  console.log('当前token:', token) // 调试日志
  
  if (!token) {
    uni.showToast({ title: '未登录，请先登录', icon: 'none' })
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  
  try {
    loading.value = true
    console.log('发送请求到:', 'https://api.fanovian.cc:3000/api/profile/getBasicInfo') // 调试日志
    
    const response = await uni.request({
      url: 'https://api.fanovian.cc:3000/api/profile/getBasicInfo', 
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    console.log('基本信息API响应:', response) // 调试日志

    if (response.data && response.data.success) {
      const user = response.data.user
      // 更新基本信息
      userInfo.value.tel = user.tel || ''
      userInfo.value.name = user.name || '用户'
    } else {
      console.error('获取基本信息API返回失败:', response.data) // 调试日志
      uni.showToast({ title: response.data?.message || '获取用户基本信息失败', icon: 'none' })
      if (response.data?.message?.includes('Token') || response.statusCode === 401) {
        uni.reLaunch({ url: '/pages/login/index' })
      }
    }
  } catch (error) {
    console.error('获取用户基本信息失败:', error)
    // 如果是网络错误，尝试从本地存储获取数据
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
    console.log('发送请求到:', 'https://api.fanovian.cc:3000/api/profile/get') // 调试日志
    
    const response = await uni.request({
      url: 'https://api.fanovian.cc:3000/api/profile/get', 
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    console.log('详细资料API响应:', response) // 调试日志

    if (response.data && response.data.success) {
      const profile = response.data.profile
      console.log('获取到的详细资料:', profile) // 调试日志
      userInfo.value = {
        ...userInfo.value, // 保留基本信息
        age: profile.age.toString(),
        gender: profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他',
        height: profile.height ? profile.height.toString() : '',
        weight_goal: profile.weight_goal ? profile.weight_goal.toString() : '',
        password: '********'
      }
    } else {
      console.error('获取详细资料API返回失败:', response.data) // 调试日志
      // 如果详细资料获取失败，不影响基本信息的显示，只是不显示详细资料
    }  } catch (error) {
    console.error('获取用户详细资料失败:', error)
    // 如果是网络错误，尝试从本地存储获取数据
    const localProfile = uni.getStorageSync('localProfile') || {}
    
    if (Object.keys(localProfile).length > 0) {
      userInfo.value = {
        ...userInfo.value, // 保留基本信息
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

  // 准备更新数据
  const updateData = {
    age: userInfo.value.age || null,
    gender: userInfo.value.gender === '男' ? 'male' : userInfo.value.gender === '女' ? 'female' : 'other',
    height: parseInt(userInfo.value.height) || null,
    weight_goal: parseFloat(userInfo.value.weight_goal) || null
  }

  // 根据修改的字段更新对应值
  if (field === 'age') updateData.age = parseInt(value) || null
  if (field === 'gender') updateData.gender = value === '男' ? 'male' : value === '女' ? 'female' : 'other'
  if (field === 'height') updateData.height = parseInt(value) || null  
  if (field === 'weightGoal') updateData.weight_goal = parseFloat(value) || null

  try {
    loading.value = true
    const response = await uni.request({
      url: 'https://api.fanovian.cc:3000/api/profile/update', 
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: updateData
    })    
    if (response.data && response.data.success) {
      uni.showToast({ title: '修改成功', icon: 'success' })
      return true
    } else {
      uni.showToast({ title: response.data?.message || '修改失败', icon: 'none' })
      console.log('发送内容:', updateData) // 调试日志
      console.log('更新用户资料API返回失败:', response) // 调试日志
      return false
    }
  } catch (error) {
    console.error('更新用户资料失败:', error)
    
    // 如果服务器不可用，保存到本地存储
    const localProfile = uni.getStorageSync('localProfile') || {}
    if (field === 'age') localProfile.age = value
    if (field === 'gender') localProfile.gender = value
    if (field === 'height') localProfile.height = value
    if (field === 'weightGoal') localProfile.weight_goal = value
    
    uni.setStorageSync('localProfile', localProfile)
    uni.showToast({ title: '服务器连接失败，已保存到本地', icon: 'none' })
    return true // 允许UI更新
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
      
      // 同时更新本地存储的用户信息
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
      
      // 密码修改成功后清除token，要求重新登录
      setTimeout(() => {
        uni.removeStorageSync('jwtToken')
        uni.removeStorageSync('userInfo')
        uni.reLaunch({ url: '/pages/login/index' })
      }, 1500)
    } else {
      uni.showToast({ title: response.data?.message || '密码修改失败', icon: 'none' })
    }  } catch (error) {
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

// 页面加载时检查服务器状态并获取用户资料
onMounted(async () => {
  await checkServerStatus()
  await fetchBasicInfo()
  await fetchUserProfile()
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
        <text class="username">{{ userInfo.name || '用户' }}</text>
        <button class="edit-btn" @click="openEditName">修改</button>
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
        </view>        <view class="profile-item">
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
          </view>        </view>
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
    
    <view style="flex:1"></view>
    <button class="logout-btn" @click="logout">退出登录</button>
  </view>
</template>

<style scoped>
.container {
  padding: 40rpx;
  background: #f5fff7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.server-status {
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 20rpx;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.status-text {
  font-size: 24rpx;
  color: #666;
}
.user-info {
  text-align: center;
  margin-bottom: 40rpx;
}
.username {
  display: block;
  font-size: 36rpx;
  color: #388e3c;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.profile-list {
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 2px 12px rgba(76,175,80,0.06);
  padding: 30rpx;
  margin-bottom: 40rpx;
}
.profile-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 0;
  border-bottom: 1px solid #f0f0f0;
}
.profile-item:last-child {
  border-bottom: none;
}
.item-left {
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-width: 180rpx;
}
.label {
  color: #388e3c;
  font-size: 28rpx;
}
.edit-btn {
  color: #43a047;
  background: none;
  border: none;
  font-size: 24rpx;
  text-decoration: underline;
  cursor: pointer;
  padding: 0 8rpx;
}
.item-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.value {
  color: #333;
  font-size: 28rpx;
  margin-left: 10rpx;
}
.logout-btn {
  width: 100%;
  background: linear-gradient(90deg, #43a047 0%, #66bb6a 100%);
  color: #fff;
  font-size: 32rpx;
  border: none;
  border-radius: 16rpx;
  padding: 22rpx 0;
  font-weight: bold;
  letter-spacing: 2rpx;
  box-shadow: 0 2px 8px rgba(76,175,80,0.10);
  margin-top: 40rpx;
  margin-bottom: 10rpx;
}
.popup-content {
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  align-items: center;
}
.save-btn {
  flex: 1;
  background: #43a047;
  color: #fff;
  border-radius: 8rpx;
  padding: 18rpx 0;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
}
.cancel-btn {
  flex: 1;
  background: #f5f5f5;
  color: #666;
  border-radius: 8rpx;
  padding: 18rpx 0;
  font-size: 28rpx;
  border: none;
}
.picker-value {
  padding: 18rpx 0;
  color: #388e3c;
  font-size: 28rpx;
  text-align: center;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400rpx;
}
.loading-text {
  color: #388e3c;
  font-size: 28rpx;
}
.popup-title {
  color: #388e3c;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  text-align: center;
}
.popup-input {
  border: 1px solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  width: 100%;
  background: #f9f9f9;
}
.popup-buttons {
  display: flex;
  gap: 20rpx;
  width: 100%;
  margin-top: 20rpx;
}
</style>