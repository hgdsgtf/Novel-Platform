package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, decodeType}
import APIs.CommentInfo
import Common.ServiceUtils.schemaName
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.parser.decode

case class GetCommentMessagePlanner(novelTitle: String, commentId: Option[Int] = None, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val baseQuery = s"SELECT * FROM ${schemaName}.comment WHERE title = ?"
    val params = List(SqlParameter("String", novelTitle))

    val query = commentId match {
      case Some(id) => s"$baseQuery AND id = ?" // 如果有评论ID，追加到查询条件中
      case None => baseQuery // 如果没有评论ID，仅按作品名称查询
    }

    val finalParams = commentId match {
      case Some(id) => params :+ SqlParameter("Int", id.toString) // 如果有评论ID，添加到参数列表中
      case None => params
    }

    println(s"Executing query: $query with params: $finalParams") // 添加调试输出

    readDBRows(query, finalParams).flatMap { result =>
      println(s"Query result: ${result.asJson.noSpaces}") // 添加调试输出

      val comments = result.map { row =>
        val id = row.hcursor.downField("id").as[Int].getOrElse(0)
        val userJson = row.hcursor.downField("username").focus
        val user = userJson match {
          case Some(json) => json.asString.getOrElse("")
          case None => ""
        }
        val content = row.hcursor.downField("content").as[String].getOrElse("")
        val likes = row.hcursor.downField("likes").as[Int].getOrElse(0)

        val createdAtJson = row.hcursor.downField("createdat").focus
        val createdAt = createdAtJson match {
          case Some(json) => json.asString.getOrElse("")
          case None => ""
        }

        val parentCommentId = row.hcursor.downField("parentcommentid").as[Option[Int]].getOrElse(None)
        val parentUserName = row.hcursor.downField("parentusername").as[Option[String]].getOrElse(None)
        val userType = row.hcursor.downField("usertype").as[Option[String]].getOrElse(None)
        val isAuthorComment = row.hcursor.downField("isauthorcomment").as[Option[String]].getOrElse(None)
        val likerJson = row.hcursor.downField("liker").as[List[String]].getOrElse(List.empty[String])

        // Then parse each string into a list of lists
        val liker = likerJson.map { str =>
          decode[List[String]](str).getOrElse(List.empty[String])
        }

        println(s"Parsed comment: $id, $user, $content, $likes, $createdAt, $parentCommentId, $parentUserName, $userType, $isAuthorComment, $liker") // 添加调试输出

        CommentInfo(id, user, content, likes, createdAt, parentCommentId, parentUserName, userType, isAuthorComment, liker)
      }

      if (comments.nonEmpty) {
        IO.pure(comments.asJson.noSpaces)
      } else {
        IO.raiseError(new Exception("未找到相关评论"))
      }
    }.handleErrorWith { error =>
      IO.raiseError(new Exception(s"获取评论信息失败: ${error.getMessage}"))
    }
  }
}
