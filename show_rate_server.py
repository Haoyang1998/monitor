import os
import asyncio
import json
import websockets
import psutil
import random

def get_tx_bytes():
    res = os.popen('ethtool -S rdma0 | grep vport_rdma_unicast_bytes').read().strip()
    res = [l.strip() for l in res.split('\n')]
    res = [l.split() for l in res]

    tx_bytes = [int(l[1]) for l in res if 'tx' in l[0]]
    rx_bytes = [int(l[1]) for l in res if 'rx' in l[0]]

    return tx_bytes, rx_bytes

def get_mem_util():
    return psutil.virtual_memory().percent

def get_cpu_util():
    return psutil.cpu_percent()

async def show_rates(websocket, path):
    pre_tx_bytes, pre_rx_bytes = get_tx_bytes()
    while True:
        await asyncio.sleep(1)
        cur_tx_bytes, cur_rx_bytes = get_tx_bytes()
        pre_tx_sum = sum(pre_tx_bytes)
        pre_rx_sum = sum(pre_rx_bytes)
        cur_tx_sum = sum(cur_tx_bytes)
        cur_rx_sum = sum(cur_rx_bytes)

        tx_diff = cur_tx_sum - pre_tx_sum
        rx_diff = cur_rx_sum - pre_rx_sum

        res = tx_diff + rx_diff

        mem_util = get_mem_util()
        cpu_util = get_cpu_util()

        data = []
        for i in range(10):
            data.append(
                {
                    'x': i,
                    'y1':random.randint(1,10),
                    'y2':random.randint(1,10),
                }
            )
        msg = json.dumps(data)
        data = []
        for i in range(10):
            data.append(
                {'name': '虚拟机' + str(i),
                'cvr': random.randint(1,10)/10,
            })
        msg2 = json.dumps(data)

        await websocket.send(json.dumps({"data":msg2, "chart":msg}))


        pre_tx_bytes = cur_tx_bytes
        pre_rx_bytes = cur_rx_bytes


if __name__ == '__main__':
    server = websockets.serve(show_rates, '0.0.0.0', 9999)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(server)
    loop.run_forever()
    #get_tx_bytes()
