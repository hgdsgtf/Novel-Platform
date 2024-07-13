import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { render } from 'react-dom'
import Homepage from './Pages/Homepage'
import WriterHomepage from './Pages/WriterHomepage'
import OtherHomepage from './Pages/OtherHomepage'
import WriterRegister from 'Pages/WriterRegister'
import WriterLogin from 'Pages/WriterLogin'
import WriterForgotPassword from 'Pages/WriterForgotPassword'
import WriterCreateNovel from 'Pages/WriterCreateNovel'
import ReaderSearchNovel from 'Pages/ReaderSearchNovel'
import ReaderMain from 'Pages/ReaderMain'
import WriterMain from 'Pages/WriterMain'
import WriterReadNovel from 'Pages/WriterReadNovel'
import ReaderReadNovel from 'Pages/ReaderReadNovel'
import WriterUpdateNovelContent from 'Pages/WriterUpdateNovelContent'
import AuditorRegister from 'Pages/AuditorRegister'
import AuditorLogin from 'Pages/AuditorLogin'
import AuditorMain from 'Pages/AuditorMain'
import WriterAddChapterContent from 'Pages/WriterAddChapter'
import AuditorViewNovel from 'Pages/AuditorViewNovel'
import ReaderAddMoney from 'Pages/ReaderAddMoney'
import ResetPassword from 'Pages/ResetPassword'
import WriterResetPassword from 'Pages/WriterResetPassword'
import NovelComments from 'Pages/NovelComments'
import AdminHomepage from 'Pages/AdminHomepage'
import AdminRegister from 'Pages/AdminRegister'
import AdminLogin from 'Pages/AdminLogin'
import AdminForgotPassword from 'Pages/AdminForgotPassword'
import AdminMain from 'Pages/AdminMain'
import AdminManageWriter from 'Pages/AdminManageWriter'
import AdminWriterProfile from 'Pages/AdminWriterProfile'
import AdminManageAuditor from 'Pages/AdminManageAuditor'
import AuditorHomepage from 'Pages/AuditorHomepage'
import EditHomepage from 'Pages/EditHomepage'
import NovelInfo from 'Pages/NovelInfo'
import WriterNovelInfo from 'Pages/WriterNovelInfo'
import Register from 'Pages/Register'
import Login from 'Pages/Login'
import ForgottenPassword from 'Pages/ForgottenPassword'
import HomePageStyleList from 'Pages/HomePageStyleList'
import EditorMain from 'Pages/EditorMain'

const Layout = () => (
    <HashRouter>
        <Switch>
            <Route path="/" exact component={Homepage} />
            <Route path="/writerhomepage" exact component={WriterHomepage} />
            <Route path="/otherhomepage" exact component={OtherHomepage} />
            <Route path="/writerregister" exact component={WriterRegister} />
            <Route path="/writerlogin" exact component={WriterLogin} />
            <Route path="/writerforgotpassword" exact component={WriterForgotPassword} />
            <Route path="/writerresetpassword" exact component={WriterResetPassword} />
            <Route path="/register" exact component={Register} />
            <Route path="/auditorregister" exact component={AuditorRegister} />
            <Route path="/login" exact component={Login} />
            <Route path="/auditorlogin" exact component={AuditorLogin} />
            <Route path="/forgottenpassword" exact component={ForgottenPassword} />
            <Route path="/resetpassword" exact component={ResetPassword} />
            <Route path="/writercreatenovel" exact component={WriterCreateNovel} />
            <Route path="/readersearchnovel" exact component={ReaderSearchNovel} />
            <Route path="/readermain" exact component={ReaderMain} />
            <Route path="/writermain" exact component={WriterMain} />
            <Route path="/auditormain" exact component={AuditorMain} />
            <Route path="/writerreadnovel" exact component={WriterReadNovel} />
            <Route path="/readerreadnovel" exact component={ReaderReadNovel} />
            <Route path="/writerupdatenovelcontent" exact component={WriterUpdateNovelContent} />
            <Route path="/writeraddchapter" exact component={WriterAddChapterContent} />
            <Route path="/auditorviewnovel" exact component={AuditorViewNovel} />
            <Route path="/readeraddmoney" exact component={ReaderAddMoney} />
            <Route path="/novelcomments" exact component={NovelComments} />
            <Route path="/adminhomepage" exact component={AdminHomepage} />
            <Route path="/adminregister" exact component={AdminRegister} />
            <Route path="/adminlogin" exact component={AdminLogin} />
            <Route path="/adminforgotpassword" exact component={AdminForgotPassword} />
            <Route path="/adminmain" exact component={AdminMain} />
            <Route path="/adminmanagewriter" exact component={AdminManageWriter} />
            <Route path="/adminmanageauditor" exact component={AdminManageAuditor} />
            <Route path="/adminwriterprofile" exact component={AdminWriterProfile} />
            <Route path="/auditorhomepage" exact component={AuditorHomepage} />
            <Route path="/edithomepage" exact component={EditHomepage} />
            <Route path="/novelinfo" exact component={NovelInfo} />
            <Route path="/writernovelinfo" exact component={WriterNovelInfo} />
            <Route path="/editormain" exact component={EditorMain} />
            <Route path="/homepagestylelist" exact component={HomePageStyleList} />
        </Switch>
    </HashRouter>
)
render(<Layout />, document.getElementById('root'))
