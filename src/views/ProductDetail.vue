<template>
  <main v-if="product" class="product-detail-page">
    <div class="container">
      <section class="summary">
        <div class="gallery">
          <div class="main-image">
            <img :src="selectedImage || product.image || (product.images && product.images[0])" :alt="product.title" />
          </div>
          <div v-if="product.images && product.images.length > 1" class="thumbnail-list">
            <div
              v-for="(img, index) in product.images"
              :key="index"
              class="thumbnail"
              :class="{ active: selectedImage === img || (!selectedImage && index === 0) }"
              @click="selectedImage = img"
            >
              <img :src="img" :alt="`${product.title} ${index + 1}`" />
            </div>
          </div>
        </div>
        <div class="info">
          <p class="category">{{ product.category }}</p>
          <h1>{{ product.title }}</h1>
          <p class="subtitle">{{ product.subtitle }}</p>
          <div class="rating">
            ⭐ {{ product.rating }} ({{ product.reviewCount }}개 리뷰)
          </div>
          <div class="price-box">
            <div>
              <p class="current-price">₩{{ product.currentPrice.toLocaleString() }}</p>
              <p class="original-price">정가 ₩{{ product.originalPrice.toLocaleString() }}</p>
            </div>
            <span class="discount">{{ product.discountRate }}% 할인</span>
          </div>
          <div class="progress-card">
            <div class="progress-head">
              <span>{{ product.currentCount }}명 참여</span>
              <span>목표 {{ product.targetCount }}명</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${Math.min(product.currentCount / product.targetCount * 100, 100)}%` }"
              ></div>
            </div>
            <p class="time-left">⏰ {{ product.timeLeft }}</p>
          </div>
          <ul class="specs">
            <li v-for="spec in product.specs" :key="spec">✅ {{ spec }}</li>
          </ul>
          <div class="actions">
            <button class="btn btn-outline" @click="goToSeller">판매자 보기</button>
            <button class="btn btn-primary" @click="addToCart">장바구니 담기</button>
          </div>
          <p class="shipping">{{ product.shipping }}</p>
        </div>
      </section>

      <section class="content">
        <article class="panel description-panel">
          <h2>상품 설명</h2>
          <p class="short-description">{{ product.description }}</p>
          <div v-if="product.detailedDescription" class="detailed-description" v-html="product.detailedDescription"></div>
          <div v-else class="detailed-description">
            <h3>제품 특징</h3>
            <p>{{ product.description }}</p>
            <h3>사용 안내</h3>
            <p>상품 수령 후 정품 인증을 진행해주시기 바랍니다. A/S는 구매일로부터 1년간 무상으로 제공됩니다.</p>
            <h3>배송 안내</h3>
            <p>결제 완료 후 1-2일 내 발송되며, 전국 어디서나 당일 배송이 가능합니다. 배송 추적은 주문 내역에서 확인하실 수 있습니다.</p>
          </div>
        </article>
        <article class="panel">
          <h2>판매자 공지</h2>
          <ul class="notice-list">
            <li v-for="notice in sellerNotices" :key="notice.id">
              <span class="tag">{{ notice.type }}</span>
              <span class="title">{{ notice.title }}</span>
              <span class="date">{{ notice.date }}</span>
            </li>
          </ul>
        </article>
        <article class="panel">
          <h2>자주 묻는 질문</h2>
          <details v-for="item in sellerQna" :key="item.id">
            <summary>{{ item.question }}</summary>
            <p>{{ item.answer }}</p>
          </details>
        </article>
      </section>
    </div>
  </main>
  <section v-else class="not-found container">
    <p>요청하신 상품을 찾을 수 없습니다.</p>
    <router-link class="btn btn-primary" to="/products">상품 목록으로 이동</router-link>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sellerNotices, sellerQna } from '@/data/products'
import api from '@/api/axios'

// eslint-disable-next-line no-undef
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const product = ref(null)
const selectedImage = ref(null)

const loadProduct = async () => {
  try {
    const response = await api.get(`/api/products/${props.id}`)
    console.log('상품 조회 성공:', response.data)

    // 백엔드 응답 데이터 구조에 맞게 매핑
    const productData = response.data.data || response.data

    product.value = {
      id: productData.id,
      title: productData.name,
      subtitle: productData.description,
      category: productData.category || '전자제품',
      image: productData.imageUrl || productData.image,
      images: productData.images || [productData.imageUrl || productData.image],
      currentPrice: productData.price,
      originalPrice: productData.originalPrice || productData.price,
      discountRate: productData.discountRate || 0,
      rating: productData.rating || 4.5,
      reviewCount: productData.reviewCount || 0,
      currentCount: productData.currentCount || 0,
      targetCount: productData.targetCount || 100,
      timeLeft: productData.timeLeft || '종료일 미정',
      specs: productData.specs || [],
      description: productData.description,
      detailedDescription: productData.detailedDescription,
      shipping: productData.shipping || '무료배송',
      seller: productData.seller
    }
  } catch (error) {
    console.error('상품 조회 실패:', error)
    product.value = null
  }
}

const goToSeller = () => {
  if (product.value && product.value.seller) {
    // 판매자 프로필 페이지로 이동 (일반 유저용)
    router.push({ name: 'seller-profile' })
  } else {
    // 판매자 대시보드로 이동 (판매자용)
    router.push({ name: 'seller' })
  }
}

const addToCart = () => {
  if (!product.value) return
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cart.push({ productId: product.value.id, quantity: 1 })
  localStorage.setItem('cart', JSON.stringify(cart))
  router.push({ name: 'cart' })
}

onMounted(() => {
  loadProduct()
})

watch(() => props.id, () => {
  loadProduct()
})
</script>

<style scoped>
.product-detail-page {
  background: #0a0a0a;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 32px;
}

.gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s;
  opacity: 0.7;
}

.thumbnail:hover {
  opacity: 1;
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: #ffffff;
  opacity: 1;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.info h1 {
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  margin: 12px 0;
}

.category {
  color: #ffffff;
  font-weight: 600;
}

.subtitle {
  color: #999;
  margin-top: 8px;
}

.rating {
  margin: 12px 0;
  color: #ffd43b;
}

.price-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
}

.original-price {
  color: #666;
  text-decoration: line-through;
}

.discount {
  background: #2a2a2a;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 12px;
  font-weight: 600;
}

.progress-card {
  margin: 16px 0;
  padding: 16px;
  border-radius: 16px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
}

.progress-head {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #ffffff;
}

.progress-bar {
  height: 10px;
  background: #2a2a2a;
  border-radius: 999px;
  margin: 12px 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ffffff;
}

.time-left {
  font-size: 14px;
  color: #999;
}

.specs {
  list-style: none;
  padding: 0;
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.specs li {
  color: #e0e0e0;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.btn {
  flex: 1;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-outline {
  background: transparent;
  border: 1px solid #3a3a3a;
  color: #ffffff;
}

.btn-outline:hover {
  background: #2a2a2a;
  border-color: #4a4a4a;
}

.btn-primary {
  background: #ffffff;
  color: #0a0a0a;
}

.btn-primary:hover {
  background: #f0f0f0;
}

.shipping {
  font-size: 14px;
  color: #999;
}

.content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.panel {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.panel h2 {
  margin-bottom: 12px;
  color: #ffffff;
}

.description-panel {
  grid-column: span 2;
}

.short-description {
  font-size: 16px;
  line-height: 1.8;
  color: #e0e0e0;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #2a2a2a;
}

.detailed-description {
  line-height: 1.8;
  color: #e0e0e0;
}

.detailed-description h3 {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 24px 0 12px;
}

.detailed-description h3:first-child {
  margin-top: 0;
}

.detailed-description p {
  margin-bottom: 16px;
  font-size: 15px;
  color: #e0e0e0;
}

.detailed-description ul {
  margin: 16px 0;
  padding-left: 24px;
}

.detailed-description li {
  margin-bottom: 8px;
  font-size: 15px;
  color: #e0e0e0;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
}

.notice-list .title {
  color: #ffffff;
}

.notice-list .date {
  color: #999;
}

.notice-list .tag {
  background: #2a2a2a;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

details {
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  background: #0f0f0f;
}

details summary {
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
}

details p {
  color: #e0e0e0;
  margin-top: 8px;
}

.not-found {
  text-align: center;
  padding: 100px 20px;
  color: #ffffff;
}

.not-found p {
  color: #ffffff;
  margin-bottom: 20px;
}

@media (max-width: 900px) {
  .summary,
  .content {
    grid-template-columns: 1fr;
  }

  .description-panel {
    grid-column: span 1;
  }
}

@media (max-width: 600px) {
  .actions {
    flex-direction: column;
  }
}
</style>

