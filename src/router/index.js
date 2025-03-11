import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../view/HomeView.vue')
    },
     {
       path: '/login',
       name: 'login',
       component: () => import("../view/forUser/ILoginViews/LoginView.vue")
     },
     {
       path: '/regist',
       name: 'regist',
       component: () => import("../view/forUser/ILoginViews/RegistView.vue")
     },
     {
          path: '/forgotPassword',
          name: 'forgotPassword',
          component: () => import("../view/forUser/ILoginViews/ForgotPasswordView.vue")
     },
     {
          path: '/userInfo',
          name: 'userInfo',
          component: () => import("../view/forUser/ILoginViews/UserInfoView.vue")
     },
     {
          path: '/updateUserInfo',
          name: 'updateUserInfo',
          component: () => import("../view/forUser/ILoginViews/UpdateUserInfoView.vue")
     },
      {
          path: '/knowledge',
          name: 'knowledge',
          component: () => import("../view/forUser/IKnowledgeViews/KnowledgeView.vue")
      },
      {
          path: '/knowledgeInfo',
          name: 'knowledgeInfo',
          component: () => import("../view/forUser/IKnowledgeViews/KnowledgeInfoView.vue")
      },
      {
          path: '/bookmark',
          name: 'bookmark',
          component: () => import("../view/forUser/IKnowledgeViews/BookmarkView.vue")
      },
      {
          path: '/feedback',
          name: 'feedback',
          component: () => import("../view/forUser/FeedbackView.vue")
      },
      {
          path: '/note',
          name: 'note',
          component: () => import("../view/forUser/INoteViews/NoteView.vue")
      },
      {
          path: '/addNote',
          name: 'addNote',
          component: () => import("../view/forUser/INoteViews/AddNoteView.vue")
      },
      {
          path: '/updateNote',
          name: 'updateNote',
          component: () => import("../view/forUser/INoteViews/UpdateNoteView.vue")
      },
     {
       path: '/productInfo',
       name: 'productInfo',
       component: () => import("../view/forUser/ShoppingViews/ProductInfoView.vue"),
     },
     {
       path: '/orders',
       name: 'orders',
       component: () => import("../view/forUser/ShoppingViews/OrdersView.vue")
     },
     {
       path: '/userAddress',
       name: 'userAddress',
       component: () => import("../view/forUser/IAddressViews/UserAddressView.vue")
     },
     {
       path: '/addAddress',
       name: 'addAddress',
       component: () => import("../view/forUser/IAddressViews/AddAddressView.vue")
     },
     {
       path: '/editAddress',
       name: 'editAddress',
       component: () => import("../view/forUser/IAddressViews/EditAddressView.vue")
     },
     {
       path: '/payment',
       name: 'payment',
       component: () => import("../view/forUser/ShoppingViews/PaymentView.vue")
     },
      {
          path: '/myOrders',
          name: 'myOrders',
          component: () => import("../view/forUser/ShoppingViews/MyOrdersView.vue")
      }
  ]
})
export default router
