<style lang="less">
    @import "main.less";
</style>
<template>
    <div id="main" class="main" :class="{'main-hide-text': hideMenuText}">
        <div class="sidebar-menu-con" :style="{width: hideMenuText?'60px':'200px', overflow: hideMenuText ? 'visible' : 'auto', background:'#495060'}">
         <!--background: $store.state.menuTheme === 'dark'?'#495060':'white'}">-->
            <div class="logo-con">
                <img v-show="!hideMenuText"  src="../../images/logo.png">
                <img v-show="hideMenuText" src="../../images/logo-min.png">
            </div>
            <sidebar-menu v-if="!hideMenuText" :menuList="menuList" :iconSize="14"></sidebar-menu>
            <sidebar-menu-shrink :icon-color="menuIconColor" v-else :menuList="menuList"></sidebar-menu-shrink>
        </div>
        <div class="main-header-con" :style="{paddingLeft: hideMenuText?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <div class="main-header">
                        <div class="user-dropdown-menu-con">
                            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                                <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                                    <a href="javascript:void(0)">
                                        <span class="main-user-name">{{ userName }}</span>
                                        <Icon type="arrow-down-b"></Icon>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <!--<DropdownItem name="ownSpace">个人中心</DropdownItem>-->
                                        <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="background: #619fe7;margin-left: 10px;"></Avatar>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>

        <div class="single-page-con" :style="{paddingLeft: hideMenuText?'60px':'200px'}">
            <router-view></router-view>
        </div>
    </div>

</template>
<script>
    import sidebarMenu from "../../components/sidebarMenu.vue";
    import sidebarMenuShrink from "../../components/sidebarMenuShrink.vue";
    import breadcrumbNav from "../../components/breadcrumbNav.vue";
    import tagsPageOpened from "../../components/tagsPageOpened.vue";
    import util from '../../libs/util.js';
    import Cookies from 'js-cookie';
    export default {
        components:{
            sidebarMenu,
            sidebarMenuShrink,
            breadcrumbNav,
            tagsPageOpened
        },
        data(){
            return{
                hideMenuText: false,
                userName: '',
                showFullScreenBtn: window.navigator.userAgent.indexOf('MSIE') < 0,
                isFullScreen: false,
                messageCount: 10,
                lockScreenSize: 0
            }
        },
        computed:{
            menuList () {
                return this.$store.state.menuList;
            },
            menuIconColor () {
                return this.$store.state.menuTheme === 'dark' ? 'white' : '#495060';
            },
            currentPath () {
                //console.log(JSON.stringify(this.$store.state.currentPath));
                return this.$store.state.currentPath;  // 当前面包屑数组
            },
            pageTagsList () {
                return this.$store.state.pageOpenedList;  // 打开的页面的页面对象
            },
            avatorPath () {
                return "https://i.loli.net/2017/08/21/599a521472424.jpg";
            }
        },
        methods:{
            init () {
                this.$store.commit('setCurrentPageName', this.$route.name);
                let pathArr = util.setCurrentPath(this, this.$route.name);
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('username');
                let messageCount = 3;
                //this.messageCount = messageCount.toString();
            },
            toggleClick () {
                this.hideMenuText = !this.hideMenuText;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openPage(this, 'ownspace_index', '个人中心');
                } else if (name === 'loginout') {
                    // 退出登录
                    Cookies.remove('username');
                    Cookies.remove('projects');
                    Cookies.remove('buildings');
                    Cookies.remove('userid');
                    this.$store.commit('clearOpenedSubmenu');
                    // 清空打开的页面等数据，但是保存主题数据
  //                  localStorage.clear();
//                    if (theme) {
//                        localStorage.theme = theme;
//                    }
//                    this.$store.commit('updateMenulist');
                    this.$router.push({
                        name: 'login'
                    });
                    //this.$store.commit('updateMenulist');
                   //util.openPage(this, 'login', '登录');
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) {  //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
            },
            lang () {
                util.setCurrentPath(this, this.$route.name);  // 在切换语言时用于刷新面包屑
            }
        },
        mounted () {
            this.init();
        },
        created(){
            // 权限菜单过滤相关
            this.$store.commit('updateMenulist');
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        },
    }
</script>
