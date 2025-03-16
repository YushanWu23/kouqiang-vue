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
          path: '/model',
          name: 'model',
          component: () => import("../view/forUser/ModelView.vue")
      },
      {
          path: '/userChat',
          name: 'userChat',
          component: () => import("../view/forUser/UserChatView.vue")
      },
      {
          path: '/docChat',
          name: 'docChat',
          component: () => import("../view/forDoctor/DocChatView.vue")
      },
      {
          path: '/adminLogin',
          name: 'adminLogin',
          component: () => import("../view/forAdmin/AdminLoginView.vue")
      },
      {
          path: '/adminInfo',
          name: 'adminInfo',
          component: () => import("../view/forAdmin/AdminInfoView.vue")
      },
      {
          path: '/adminForgotPwd',
          name: 'adminForgotPwd',
          component: () => import("../view/forAdmin/AdminForgotPwdView.vue")
      },
      {
          path: '/adminSchedule',
          name: 'adminSchedule',
          component: () => import("../view/forAdmin/AdminScheduleView.vue")
      },
      {
          path: '/adminMedicalRecord',
          name: 'adminMedicalRecord',
          component: () => import("../view/forAdmin/AdminMedicalRecordView.vue")
      },
      {
          path: '/userMedicalRecord',
          name: 'userMedicalRecord',
          component: () => import("../view/forUser/UserMedicalRecordView.vue")
      },
      {
          path: '/allFeedback',
          name: 'allFeedback',
          component: () => import("../view/forAdmin/AllFeedbackView.vue")
      },
      {
          path: '/docLogin',
          name: 'docLogin',
          component: () => import("../view/forDoctor/DocLoginView.vue")
      },
      {
          path: '/doctorInfo',
          name: 'doctorInfo',
          component: () => import("../view/forDoctor/DoctorInfoView.vue")
      },
      {
          path: '/docForgotPwd',
          name: 'docForgotPwd',
          component: () => import("../view/forDoctor/DocForgotPwdView.vue")
      },
      {
          path: '/docSchedule',
          name: 'docSchedule',
          component: () => import("../view/forDoctor/DocScheduleView.vue")
      },
      {
          path: '/docAllSchedule',
          name: 'docAllSchedule',
          component: () => import("../view/forDoctor/DocAllScheduleView.vue")
      },
      {
          path: '/docReservation',
          name: 'docReservation',
          component: () => import("../view/forDoctor/DocReservationView.vue")
      },
      {
          path: '/docMedicalRecord',
          name: 'docMedicalRecord',
          component: () => import("../view/forDoctor/DocMedicalRecordView.vue")
      },
      {
          path: '/docMedicalRecordInfo',
          name: 'docMedicalRecordInfo',
          component: () => import("../view/forDoctor/DocMedicalRecordInfoView.vue")
      },
      {
          path: '/docCreateMedicalRecord',
          name: 'docCreateMedicalRecord',
          component: () => import("../view/forDoctor/DocCreateMedicalRecordViewView.vue")
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
          path: '/reservation',
          name: 'reservation',
          component: () => import("../view/forUser/IReservationViews/ReservationView.vue")
      },
      {
          path: '/userReservation',
          name: 'userReservation',
          component: () => import("../view/forUser/IReservationViews/UserReservationView.vue")
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
