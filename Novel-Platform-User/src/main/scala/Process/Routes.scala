package Process

import Common.API.PlanContext
import Impl.*
import cats.effect.*
import io.circe.generic.auto.*
import io.circe.parser.decode
import io.circe.syntax.*
import org.http4s.*
import org.http4s.dsl.io.*

object Routes:
  private def executePlan(messageType: String, str: String): IO[String] =
    messageType match {
      case "UserLoginMessage" =>
        IO(
          decode[UserLoginMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for UserLoginMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "UserRegisterMessage" =>
        IO(
          decode[UserRegisterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for UserRegisterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "UserSendCodeMessage" =>
        IO(
          decode[UserSendCodeMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for UserSendCodeMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetUserNameMessage" =>
        IO(
          decode[GetUserNameMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetUserNameMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetUserTypeByTokenMessage" =>
        IO(
          decode[GetUserTypeByTokenMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetUserTypeByTokenMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetUserIDByTokenMessage" =>
        IO(
          decode[GetUserIDByTokenMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetUserIDByTokenMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderBookshelfMessage" =>
        IO(
          decode[BookshelfMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for BookshelfMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderSearchNovelMessage" =>
        IO(
          decode[SearchNovelMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for SearchNovelMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderAddNovelMessage" =>
        IO(
          decode[AddNovelMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for AddNovelMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderDeleteNovelMessage" =>
        IO(
          decode[DeleteNovelMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for DeleteNovelMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderPurchaseNovelMessage" =>
        IO(
          decode[PurchaseMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ReaderPurchaseNovelMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "UserVerifyMessage" =>
        IO(
          decode[UserVerifyMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for UserVerifyMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "UserResetMessage" =>
        IO(
          decode[UserResetMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for UserResetMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderGetUsernameMessage" =>
        IO(
          decode[GetUserNameMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetUsernameMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderSetOldChapterMessage" =>
        IO(
          decode[SetOldChapterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for SetOldChapterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderGetOldChaptersMessage" =>
        IO(
          decode[GetOldChaptersMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetOldChaptersMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderReportIssueMessage" =>
        IO(
          decode[ReportIssueMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ReportIssueMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case _ =>
        IO.raiseError(new Exception(s"Unknown type: $messageType"))
    }

  val service: HttpRoutes[IO] = HttpRoutes.of[IO]:
    case req @ POST -> Root / "api" / name =>
      println("request received")
      req
        .as[String]
        .flatMap { executePlan(name, _) }
        .flatMap(Ok(_))
        .handleErrorWith { e =>
          println(e)
          BadRequest(e.getMessage)
        }
