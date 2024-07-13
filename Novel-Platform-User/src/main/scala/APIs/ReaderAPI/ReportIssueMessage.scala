package APIs.ReaderAPI

case class ReportIssueMessage(title: String, chapter: Int, issue: String)
    extends ReaderMessage[String]
