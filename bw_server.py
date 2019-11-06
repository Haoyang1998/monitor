import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
  def
  def get(self):
     self.write("Hello, world")     # 4

      def make_app():
          return tornado.web.Application([
        (r"/", MainHandler),     # 2
    ])

if __name__ == "__main__":
    app = make_app()     # 1
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
