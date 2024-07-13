package APIs

case class ReaderReportIssueMessage(title: String, chapter: Int, issue: String)
    extends NovelMessage[String]
