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
      case "GetHomepageStyleMessage" =>
        IO(
          decode[GetHomepageStyleMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetHomepageStyleMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "SetHomepageStyleMessage" =>
        IO(
          decode[SetHomepageStyleMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for SetHomepageStyleMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetAllStyleMessage" =>
        IO(
          decode[GetAllStyleMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for GetAllStyleMessage")
          )
        )
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "DeleteStyleMessage" =>
        IO(
          decode[DeleteStyleMessagePlanner](str).getOrElse(
            throw new Exception("Invalid JSON for DeleteStyleMessage")
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
