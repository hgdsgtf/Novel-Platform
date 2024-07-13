package Process

import Common.API.PlanContext
import Impl.{GetUsernameMessagePlanner, VerifyMessagePlanner, *}
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
      case "WriterLoginMessage" =>
        IO(
          decode[LoginMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for LoginMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "WriterRegisterMessage" =>
        IO(
          decode[RegisterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for RegisterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "RegisterWriterRequest" =>
        IO(
          decode[RegisterWriterRequestPlanner](str).getOrElse(
            throw new Exception("Invalid JSON for RegisterWriterRequest")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "WriterSendCodeMessage" =>
        IO(
          decode[SendCodeMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for SendCodeMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "WriterVerifyMessage" =>
        IO(
          decode[VerifyMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for VerifyMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "WriterResetMessage" =>
        IO(
          decode[ResetMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for ResetMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "WriterCreateNovelMessage" =>
        IO(
          decode[CreateNovelMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for CreateNovelMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "WriterBookshelfMessage" =>
        IO(
          decode[BookshelfMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for BookshelfMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "WriterGetUsernameMessage" =>
        IO(
          decode[GetUsernameMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetUsernameMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "WriterDeleteWriterMessage" =>
        IO(
          decode[DeleteWriterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for WriterDeleteWriterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminWriterInfoMessage" =>
        IO(
          decode[WriterInfoPlanner](str).getOrElse(
            throw new Exception("Invalid JSON for WriterInfoMessage")
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
