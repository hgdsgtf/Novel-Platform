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
      case "AuditorLoginMessage" =>
        IO(
          decode[LoginMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for LoginMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorRegisterMessage" =>
        IO(
          decode[RegisterMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for RegisterMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorSendCodeMessage" =>
        IO(
          decode[SendCodeMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for SendCodeMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorGetPermissionMessage" =>
        IO(
          decode[GetPermissionMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetPermissionMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AuditorGetQualifiedMessage" =>
        IO(
          decode[GetQualifiedMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for AuditorGetQualifiedMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "RegisterAuditorRequest" =>
        IO(
          decode[RegisterAuditorRequestPlanner](str).getOrElse(
            throw new Exception("Invalid JSON for RegisterAuditorRequest")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminAuditorInfoMessage" =>
        IO(
          decode[AuditorInfoPlanner](str).getOrElse(
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
