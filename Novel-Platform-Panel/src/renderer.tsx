import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { render } from 'react-dom'
import Homepage from 'Pages/Public/Homepage'
import WriterHomepage from 'Pages/Writer/WriterHomepage'
import OtherHomepage from 'Pages/Public/OtherHomepage'
import WriterRegister from 'Pages/Writer/WriterRegister'
import WriterLogin from 'Pages/Writer/WriterLogin'
import WriterForgotPassword from 'Pages/Writer/WriterForgotPassword'
import WriterCreateNovel from 'Pages/Writer/WriterCreateNovel'
import ReaderSearchNovel from 'Pages/Reader/ReaderSearchNovel'
import ReaderMain from 'Pages/Reader/ReaderMain'
import WriterMain from 'Pages/Writer/WriterMain'
import WriterReadNovel from 'Pages/Writer/WriterReadNovel'
import ReaderReadNovel from 'Pages/Reader/ReaderReadNovel'
import WriterUpdateNovelContent from 'Pages/Writer/WriterUpdateNovelContent'
import AuditorRegister from 'Pages/Auditor/AuditorRegister'
import AuditorLogin from 'Pages/Auditor/AuditorLogin'
import AuditorMain from 'Pages/Auditor/AuditorMain'
import WriterAddChapterContent from 'Pages/Writer/WriterAddChapter'
import AuditorViewNovel from 'Pages/Auditor/AuditorViewNovel'
import ReaderAddMoney from 'Pages/Reader/ReaderAddMoney'
import ResetPassword from 'Pages/Public/ResetPassword'
import WriterResetPassword from 'Pages/Writer/WriterResetPassword'
import NovelComments from 'Pages/Comment/NovelComments'
import AdminHomepage from 'Pages/Admin/AdminHomepage'
import AdminRegister from 'Pages/Admin/AdminRegister'
import AdminLogin from 'Pages/Admin/AdminLogin'
import AdminForgotPassword from 'Pages/Admin/AdminForgotPassword'
import AdminMain from 'Pages/Admin/AdminMain'
import AdminManageWriter from 'Pages/Admin/AdminManageWriter'
import AdminWriterProfile from 'Pages/Admin/AdminWriterProfile'
import AdminManageAuditor from 'Pages/Admin/AdminManageAuditor'
import AuditorHomepage from 'Pages/Auditor/AuditorHomepage'
import EditHomepage from 'Pages/Editor/EditHomepage'
import NovelInfo from 'Pages/Public/NovelInfo'
import WriterNovelInfo from 'Pages/Writer/WriterNovelInfo'
import Register from 'Pages/Public/Register'
import Login from 'Pages/Public/Login'
import ForgottenPassword from 'Pages/Public/ForgottenPassword'
import HomePageStyleList from 'Pages/Public/HomePageStyleList'
import EditorMain from 'Pages/Editor/EditorMain'
import StyleList from 'Pages/Public/StyleList'
import EditNovelInfo from 'Pages/Editor/EditNovelInfo'
import EditCommentItem from 'Pages/Editor/EditCommentItem';
import EditNovelComments from 'Pages/Editor/EditNovelComments';
import EditReaderReadNovel from 'Pages/Editor/EditReaderReadNovel';
import EditWriterNovelInfo from 'Pages/Editor/EditWriterNovelInfo';
import EditWriterReadNovel from 'Pages/Editor/EditWriterReadNovel';
import EditAuditorViewNovel from 'Pages/Editor/EditAuditorViewNovel';
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
            <Route path="/stylelist" exact component={StyleList} />
            <Route path="/editnovelinfo" exact component={EditNovelInfo} />
            <Route path="/editcommentitem" exact component={EditCommentItem} />
            <Route path="/editnovelcomments" exact component={EditNovelComments} />
            <Route path="/editreaderreadnovel" exact component={EditReaderReadNovel} />
            <Route path="/editwriternovelinfo" exact component={EditWriterNovelInfo} />
            <Route path="/editwriterreadnovel" exact component={EditWriterReadNovel} />
            <Route path="/editauditorviewnovel" exact component={EditAuditorViewNovel} />
        </Switch>
    </HashRouter>
)
render(<Layout />, document.getElementById('root'))
