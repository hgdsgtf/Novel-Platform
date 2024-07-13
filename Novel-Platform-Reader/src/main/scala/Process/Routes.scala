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
      case "ReaderLoginMessage" =>
        IO(
          decode[LoginMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for LoginMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderRegisterMessage" =>
        IO(
          decode[RegisterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for RegisterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "RegisterReaderRequest" =>
        IO(
          decode[RegisterReaderRequestPlanner](str).getOrElse(
            throw new Exception("Invalid JSON for RegisterReaderRequestMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderSendCodeMessage" =>
        IO(
          decode[SendCodeMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for SendCodeMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderResetMessage" =>
        IO(
          decode[ResetMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ResetMessage")
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
      case "ReaderVerifyMessage" =>
        IO(
          decode[VerifyMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for VerifyMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderGetUsernameMessage" =>
        IO(
          decode[GetUsernameMessagePlanner](str).getOrElse(
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
      case "ReaderGetMoneyMessage" =>
        IO(
          decode[GetMoneyMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetMoneyMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "ReaderAddMoneyMessage" =>
        IO(
          decode[AddMoneyMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for AddMoneyMessage")
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
