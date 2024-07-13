package Process

import Common.API.PlanContext
import Impl.*
import cats.effect.*
import io.circe.generic.auto.*
import io.circe.parser.decode
import io.circe.syntax.*
import org.http4s.*
import org.http4s.client.Client
import org.http4s.dsl.io.*

object Routes:
  private def executePlan(messageType: String, str: String): IO[String] =
    messageType match {
      case "WriterGetChaptersMessage" =>
        IO(
          decode[WriterGetChaptersMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for WriterGetChaptersMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "WriterAddChapterMessage" =>
        IO(
          decode[WriterAddChapterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for WriterAddChapterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorGetChaptersMessage" =>
        IO(
          decode[AuditorGetChaptersMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for AuditorGetChaptersMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderGetChaptersMessage" =>
        IO(
          decode[ReaderGetChaptersMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ReaderGetChaptersMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderGetAccessMessage" =>
        IO(
          decode[ReaderGetAccessMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ReaderGetAccessMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderGetPartMessage" =>
        IO(
          decode[ReaderGetPartMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ReaderGetPartMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SearchNovelMessage" =>
        IO(
          decode[SearchNovelMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for SearchNovelMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetChapterMessage" =>
        IO(
          decode[GetChapterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetChapterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetFilteredChapterMessage" =>
        IO(
          decode[GetFilteredChapterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetChapterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetChapterPriceMessage" =>
        IO(
          decode[GetChapterPriceMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetChapterPriceMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "ReaderReportIssueMessage" =>
        IO(
          decode[ReaderReportIssueMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ReportIssueMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AddReaderRequest" =>
        IO(
          decode[AddReaderMessage](str).getOrElse(
            throw new Exception("Invalid JSON for AddReaderReaderRequest")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "WriterGetCommentMessage" =>
        IO(
          decode[WriterGetCommentMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for WriterGetCommentMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetAuthorMessage" =>
        IO(
          decode[GetAuthorMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetAuthorMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "WriterUpdateNovelContentMessage" =>
        IO(
          decode[UpdateNovelContentMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for UpdateNovelContentMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorApproveChapterMessage" =>
        IO(
          decode[AuditorApproveChapterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ApproveChapterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorRejectChapterMessage" =>
        IO(
          decode[AuditorRejectChapterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for RejectChapterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorFilterMessage" =>
        IO(
          decode[AuditorFilterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for AuditorFilterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorResetChapterMessage" =>
        IO(
          decode[AuditorResetMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for AuditorResetMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorGetIssuesMessage" =>
        IO(
          decode[AuditorGetIssuesMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for AuditorGetIssuesMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorGetCommentMessage" =>
        IO(
          decode[AuditorGetCommentMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for AuditorGetIssuesMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "NovelInfoMessage" =>
        IO(
          decode[NovelInfoPlanner](str).getOrElse(
            throw new Exception("Invalid JSON for NovelInfo")
          )
        ).flatMap { m =>
          m.fullPlan.map(_.asJson.toString)
        }
      case "GetChapterRatingMessage" =>
        IO(
          decode[ChapterRatesPlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ChapterRates")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderMakeNovelRateMessage" =>
        IO(
          decode[ReaderMakeNovelRatePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ReaderMakeNovelRate")
          )
        ).flatMap { m =>
          m.fullPlan.map(_.asJson.toString)
        }
      case "ReaderMakeChapterRateMessage" =>
        IO(
          decode[ReaderMakeChapterRatePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ReaderMakeChapterRate")
          )
        ).flatMap { m =>
          m.fullPlan.map(_.asJson.toString)
        }
      case "RegisterNovelRequest" =>
        IO(
          decode[RegisterNovelRequestPlanner](str).getOrElse(
            throw new Exception("Invalid JSON for RegisterNovelRequest")
          )
        ).flatMap { m =>
          m.fullPlan.map(_.asJson.toString)
        }

      case _ =>
        IO.raiseError(new Exception(s"Unknown type: $messageType"))
    }

  val service: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ POST -> Root / "api" / name =>
      println("request received")
      req
        .as[String]
        .flatMap(executePlan(name, _))
        .flatMap(Ok(_))
        .handleErrorWith { e =>
          println(e)
          BadRequest(e.getMessage)
        }
  }
