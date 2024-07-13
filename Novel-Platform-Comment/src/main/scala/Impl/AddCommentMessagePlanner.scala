package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{writeDB, readDBRows}
import Common.ServiceUtils.schemaName
import Common.Object.SqlParameter
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

case class AddCommentMessagePlanner(
                                     novelTitle: String,
                                     user: String,
                                     content: String,
                                     parentCommentId: Option[Int],
                                     parentUserName: Option[String],
                                     userType: String,
                                     isAuthorComment: Boolean,
                                     override val planContext: PlanContext
                                   ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
    val baseFields = "title, username, content, createdat, usertype, isauthorcomment"
    val baseValues = "?, ?, ?, ?, ?, ?"
    val baseParams = List(
      SqlParameter("String", novelTitle),
      SqlParameter("String", user),
      SqlParameter("String", content),
      SqlParameter("String", currentTime),
      SqlParameter("String", userType),
      SqlParameter("String", isAuthorComment.toString)
    )
    val (fields, values, params) = (parentCommentId, parentUserName) match {
      case (Some(commentId), Some(userName)) =>
        (
          s"$baseFields, parentcommentid, parentusername",
          s"$baseValues, ?, ?",
          baseParams ++ List(SqlParameter("Int", commentId.toString), SqlParameter("String", userName))
        )
      case (Some(commentId), None) =>
        (s"$baseFields, parentcommentid", s"$baseValues, ?", baseParams ++ List(SqlParameter("Int", commentId.toString)))
      case (None, Some(userName)) =>
        (s"$baseFields, parentusername", s"$baseValues, ?", baseParams ++ List(SqlParameter("String", userName)))
      case (None, None) =>
        (baseFields, baseValues, baseParams)
    }

    val insertCommentQuery = s"INSERT INTO ${schemaName}.comment ($fields) VALUES ($values)"
    println(s"Inserting comment with query: $insertCommentQuery and params: $params")
    try {
      writeDB(insertCommentQuery, params).map { _ =>
        s"""{"success": true}"""
      }
    } catch {
      case e:Exception => IO.raiseError(new Exception("System error"))
    }
  }
}