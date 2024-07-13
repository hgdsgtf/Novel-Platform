package Common.API

import Global.ServiceCenter.novelServiceCode

case class GetAuthorMessage(title: String) extends API[String](novelServiceCode) 
