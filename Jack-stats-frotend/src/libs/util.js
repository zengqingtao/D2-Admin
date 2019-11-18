import log from './util.log.js'
import cookies from './util.cookies.js'
import { validatenull } from './validate'

const TokenKey = 'x-access-token'
let util = {
  cookies,
  log
}

/**
 * 获取access_token
 */
util.getToken = function () {
  return util.cookies.get(TokenKey)
}

/**
 * 设置access_token
 */
util.setToken = function (token) {
  util.cookies.set(TokenKey, token)
}

/**
 * 删除access_token
 */
util.removeToken = function () {
  util.cookies.remove(TokenKey)
}

/**
 * 生成随机len位数字
 */
util.randomLenNum = function (len, date) {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, typeof len === 'number' ? len : 4)
  if (date) random = random + Date.now()
  return random
}

/**
 * 初始化顶部菜单
 * @param {用户菜单} menu
 */
util.initHeaderMenu = function (menu) {
  return getMenu(menu)
}

/**
 * 初始化左边菜单
 * @param {用户菜单} menu
 */
util.initAsideMenu = function (menu) {
  return getMenu(menu)
}

function getMenu (menu, path) {
  if (validatenull(menu)) {
    return []
  }
  let list = []
  for (const m of menu) {
    let item = {
      path: path ? path + '/' + m.path : m.path,
      title: m.name,
      icon: m.icon,
      url: m.url
    }
    if (m.children && m.children.length > 0) {
      item.children = getMenu(m.children, m.path)
    }
    list.push(item)
  }
  return list
}

/**
 * 通过用户菜单生成路由信息
 *
 * @param {用户菜单} aMenu
 */
util.formatRoutes = function (aMenu, parentPath) {
  console.log("parentPath----------------",parentPath);
  if (validatenull(aMenu)) {
    return []
  }
  // console.log("oMenu---------:",oMenu);
  const aRouter = []
  aMenu.forEach(oMenu => {
    const {
      path,
      component,
      name,
      icon,
      children
    } = oMenu

    if (!validatenull(component)) {
      const oRouter = {
        path: parentPath ? parentPath + '/' + path : path,
        component (resolve) {
          let componentPath = ''
          if (component === 'Layout') {
            require(['@/layout/header-aside'], resolve)
            return
          } else {
            componentPath = component
          }
          require([`../${componentPath}.vue`], resolve)
        },
        name: name,
        icon: icon,
        children: validatenull(children) ? [] : util.formatRoutes(children, path),
        meta: {
          requiresAuth: true,
          title: name
        }
      }
      aRouter.push(oRouter)
    }
  })
  return aRouter
}


/**
 * 检查路由是否在list里面
 */
util.checkRoute = function (aMenu, path) {
  var isRoute = false
  aMenu.forEach((item) => {
    item.children.forEach((i) => {
      if (item.path + '/' + i.path) {
        isRoute = true
      }
    })
  })
  return isRoute
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'D2Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-menu-link')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-menu-link'))
}

export default util
