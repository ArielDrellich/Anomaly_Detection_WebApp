cmd_Release/obj.target/API.node := g++ -o Release/obj.target/API.node -shared -pthread -rdynamic -m64  -Wl,-soname=API.node -Wl,--start-group Release/obj.target/API/API.o -Wl,--end-group -lnode
