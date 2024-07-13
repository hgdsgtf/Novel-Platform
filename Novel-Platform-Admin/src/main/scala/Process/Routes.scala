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
  private def executePlan(messageType:String, str: String): IO[String]=
    messageType match {
      case "AdminLoginMessage" =>
        IO(decode[LoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for LoginMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminRegisterMessage" =>
        IO(decode[RegisterMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for RegisterMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminSendCodeMessage" =>
        IO(decode[SendCodeMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for SendCodeMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminResetMessage" =>
        IO(decode[ResetMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for ResetMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      
      
      case "AdminUpdateClicksMessage" =>
        IO(decode[UpdateClicksPlanner](str).getOrElse(throw new Exception("Invalid JSON for WriterInfoMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminUpdateClicksByDateMessage" =>
        IO(decode[UpdateClicksByDatePlanner](str).getOrElse(throw new Exception("Invalid JSON for WriterInfoMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminGetWriterClickRatesMessage" =>
        IO(decode[GetWriterClickRatesPlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetWriterClickRatesMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case _ =>
        IO.raiseError(new Exception(s"Unknown type: $messageType"))
    }

  val service: HttpRoutes[IO] = HttpRoutes.of[IO]:
    case req @ POST -> Root / "api" / name =>
        println("request received")
        req.as[String].flatMap{executePlan(name, _)}.flatMap(Ok(_))
        .handleErrorWith{e =>
          println(e)
          BadRequest(e.getMessage)
        }
