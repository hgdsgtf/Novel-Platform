
package Impl

import cats.effect.IO
import cats.implicits._
import io.circe.generic.auto._
import io.circe.parser.decode
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{writeDB, readDBRows}
import Common.ServiceUtils.schemaName
import Common.Object.SqlParameter

case class DeleteCommentPlanner(userName: String, novelId: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    println(s"Received DeleteCommentPlanner with userName: $userName, novelId: $novelId, planContext: $planContext")

    val findCommentQuery = s"SELECT parentcommentid FROM ${schemaName}.comment WHERE id = ? "
    val findCommentParams = List(
      SqlParameter("Int", novelId.toString)
    )

    readDBRows(findCommentQuery, findCommentParams).flatMap { result =>
      val parentCommentId = result.head.hcursor.downField("parentcommentid").as[Option[Int]].getOrElse(None)
      println(s"parentCommentId: $parentCommentId")

      parentCommentId match {
        case Some(_) =>
          deleteSingleComment(novelId)
        case None =>
          deleteCommentAndChildren(novelId)
      }
    }.handleErrorWith { error =>
      println(s"Failed to delete comment: ${error.getMessage}")
      IO.raiseError(new Exception(s"删除评论失败: ${error.getMessage}"))
    }
  }

  private def deleteSingleComment(novelId: Int)(using planContext: PlanContext): IO[String] = {
    println(s"Deleting single comment with ID: $novelId")
    val deleteQuery = s"DELETE FROM ${schemaName}.comment WHERE id = ?"
    val deleteParams = List(SqlParameter("Int", novelId.toString))

    writeDB(deleteQuery, deleteParams).flatMap { result =>
      if (result.contains("Operation(s) done successfully")) {
        println(s"Comment with ID $novelId deleted successfully.")
        IO.pure(s"评论删除成功，ID: $novelId")
      } else {
        IO.raiseError(new Exception("评论删除失败"))
      }
    }
  }

  private def deleteCommentAndChildren(novelId: Int)(using planContext: PlanContext): IO[String] = {
    println(s"Deleting comment and its children with ID: $novelId")
    val findChildrenQuery = s"SELECT id FROM ${schemaName}.comment WHERE parentcommentid = ?"
    val findChildrenParams = List(SqlParameter("Int", novelId.toString))

    readDBRows(findChildrenQuery, findChildrenParams).flatMap { childrenResult =>
      val childCommentIds = childrenResult.map(_.hcursor.downField("id").as[Int].getOrElse(0))

      val deleteChildrenIO = childCommentIds.map(id => deleteCommentAndChildren(id)).sequence

      deleteChildrenIO.flatMap { _ =>
        deleteSingleComment(novelId)
      }
    }
  }
}
