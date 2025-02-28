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
       component: () => import("../view/LoginViews/LoginView.vue")
     },
     {
       path: '/regist',
       name: 'regist',
       component: () => import("../view/LoginViews/RegistView.vue")
     },
     {
          path: '/forgotPassword',
          name: 'forgotPassword',
          component: () => import("../view/LoginViews/ForgotPasswordView.vue")
     },
     {
       path: '/businessList',
       name: 'businessList',
       component: () => import("../view/ShoppingViews/BusinessListView.vue")
     },
     {
       path: '/businessInfo',
       name: 'businessInfo',
       component: () => import("../view/ShoppingViews/BusinessInfoView.vue"),
     },
     {
       path: '/orders',
       name: 'orders',
       component: () => import("../view/ShoppingViews/OrdersView.vue")
     },
     {
       path: '/userAddress',
       name: 'userAddress',
       component: () => import("../view/ShoppingViews/UserAddressView.vue")
     },
     {
       path: '/addAddress',
       name: 'addAddress',
       component: () => import("../view/ShoppingViews/AddAddressView.vue")
     },
     {
       path: '/editAddress',
       name: 'editAddress',
       component: () => import("../view/ShoppingViews/EditAddressView.vue")
     },
     {
       path: '/payment',
       name: 'payment',
       component: () => import("../view/ShoppingViews/PaymentView.vue")
     },
      {
          path: '/myOrders',
          name: 'myOrders',
          component: () => import("../view/ShoppingViews/MyOrdersView.vue")
      }
  ]
})
export default router
