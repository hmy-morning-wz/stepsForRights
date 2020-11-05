const mockData = {
    task: {},
    cellSteps: 0,
    remainingSteps: 1
};
const MOCK = false;
export default {
    getTaskState({ userTaskList }, { userId }) {
        return {
            url: '/preheatRedBag/taskState',
            method: "POST",
            nextAction: "updateTaskList",
            retry: true,
            data: {
                userId,
                userTaskList
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: MOCK && userTaskList.map((t) => {
                        return { sellerId: t, state: mockData.task[t] };
                    })
                }
            }
        };
    },
    getStoreTaskState({ storeTaskList }, { userId }) {
        return {
            url: '/preheatStore/storeTaskState',
            method: "POST",
            nextAction: "actionGetStoreTaskState",
            retry: true,
            data: {
                userId,
                storeTaskList
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: [{
                            sellerId: 1,
                            state: 1
                        }]
                }
            }
        };
    },
    getShareRecordList(_, { userId }) {
        return {
            url: '/double11share/getShareRecordList',
            method: "POST",
            nextAction: "actionGetShareRecordList",
            retry: true,
            data: {
                userId
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: {
                        amountMoney: 100,
                        list: [{
                                id: 1, userId: 0, sharedUserId: "2088", shareMoney: 9.99, state: 1,
                                gmtCreate: '20200901',
                                gmtModified: '20200901',
                            }]
                    }
                }
            }
        };
    },
    preheatRedBagShow(_, { userId }) {
        return {
            url: '/preheatRedBag/show',
            method: "GET",
            nextAction: "actionPreheatRedBagShow",
            retry: true,
            data: {
                userId,
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: {
                        userId: "", sumAmount: "10", count: 10, amount: 0.00, sellerId: "22222", redBagId: "33333", state: mockData.state || 0
                    }
                }
            }
        };
    },
    preheatRedBagDouble({ sellerId, sharerId, redBagId, userTaskNumber }, { userId }) {
        if (MOCK) {
            mockData.task[sellerId] = 1;
            mockData.state = 1;
            console.log("MOCK", mockData);
        }
        return {
            url: '/preheatRedBag/double',
            method: "POST",
            nextAction: ["actionPreheatRedBagDouble", "getTaskState", "$service:preheatRedBagShow"],
            retry: true,
            data: {
                userId,
                sellerId,
                sharerId,
                redBagId,
                userTaskNumber
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: { amount: 10, count: userTaskNumber / 2, progressBar: userTaskNumber }
                }
            }
        };
    },
    pereheatRedBagPopup({ taskNumber }, { userId }) {
        if (MOCK) {
        }
        return {
            url: '/preheatRedBag/popup',
            method: "GET",
            nextAction: ["actionPereheatRedBagPopup"],
            retry: true,
            data: {
                userId,
                taskNumber
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: { doubleAmount: 10, count: ~~taskNumber / 2, progressBar: taskNumber }
                }
            }
        };
    },
    preheatRedBagSend({ redBagId }, { userId }) {
        return {
            url: '/preheatRedBag/send',
            method: "POST",
            nextAction: ["actionPreheatRedBagSend", "$service:preheatRedBagShow"],
            retry: true,
            data: {
                userId,
                redBagId
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: { amount: 10 }
                }
            }
        };
    },
    getInitiationLimitList(_, { userId }) {
        return {
            url: '/double11data/getInitiationLimitList',
            method: "GET",
            nextAction: "updateTaskList",
            retry: true,
            data: {},
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: [{ taskId: "1" }]
                }
            }
        };
    },
    getStoreLimitList(_, { userId }) {
        return {
            url: '/double11data/getStoreLimitList',
            method: "GET",
            nextAction: "actionGetStoreLimitList",
            retry: true,
            data: {},
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: []
                }
            }
        };
    },
    preheatRedBagRandom({ sellerId }, { userId }) {
        return {
            url: '/preheatStore/storeRedBag',
            method: "POST",
            nextAction: "actionPreheatRedBagRandom",
            retry: true,
            data: {
                userId,
                sellerId
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: { amount: 100.00 }
                }
            }
        };
    },
    preheatRedBagList(_, { userId }) {
        return {
            url: '/winningRecord/list',
            method: "GET",
            nextAction: "actionPreheatRedBagList",
            retry: true,
            data: {
                userId,
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: [{ prizeName: "奖品名", receiveTime: "20200901" }]
                }
            }
        };
    },
    getEntityPrizeList({ activityId }, { userId }) {
        return {
            url: '/double11Game/getEntityPrizeList',
            method: "POST",
            nextAction: "actionGetEntityPrizeList",
            retry: true,
            data: {
                userId,
                activityId
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: [{ prizeId: "1", status: 1
                        },
                        { prizeId: "2", status: 2 },
                        { prizeId: "3", status: 3 },
                        { prizeId: "4", status: 0 },
                        { prizeId: "5", status: 1 },
                        { prizeId: "6", status: 2 }
                    ]
                }
            }
        };
    },
    getEntityPrize({ activityId, prizeId }, { userId }) {
        return {
            url: '/double11Game/getEntityPrize',
            method: "POST",
            nextAction: ["actionGetEntityPrize", "getEntityPrizeList"],
            retry: true,
            data: {
                userId,
                prizeId,
                activityId
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: {
                        prizeId, name: "实物奖品",
                        picture: 'https://images.allcitygo.com/image/double202011/pic_hongbao.png?x-oss-process=image/format,webp', winStatus: '1', gameRecordId: '123456',
                        sendLastVoucherList: [{ prizeName: "", prizeAmount: "", url: "" }]
                    }
                }
            }
        };
    },
    addPrizeAddress({ gameRecordId, address, country, prov, city, area, street, fullname, mobilePhone }, { userId }) {
        return {
            url: '/double11Game/addPrizeAddress',
            method: "POST",
            nextAction: "actionAddPrizeAddress",
            retry: true,
            data: {
                userId,
                gameRecordId, address, country, prov, city, area, street, fullname, mobilePhone
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: {}
                }
            }
        };
    },
    getIndustryVoucher({ campId, activityId }, { userId }) {
        return {
            url: '/double11Game/getIndustryVoucher',
            method: "POST",
            nextAction: "actionGetIndustryVoucher",
            retry: true,
            data: {
                userId,
                campId, activityId
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: { prizeName: "0.5元乘车券", prizeAmount: "" }
                }
            }
        };
    },
    sendVoucher(_, { userId }) {
        return {
            url: '/preheatRedBag/sendVoucher',
            method: "GET",
            nextAction: "actionSendVoucher",
            retry: true,
            data: {
                userId,
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: { list: [{ prizeName: "0.5元乘车券", prizeAmount: "" }] }
                }
            }
        };
    },
    sendRedBag({ sellerId, limitCount, switchFlag, redBagId }, { userId }) {
        return {
            url: '/preheatRedBag/sendRedBag',
            method: "POST",
            nextAction: ["actionSendRedBag", "$service:preheatRedBagShow", "getTaskState"],
            retry: true,
            data: {
                userId,
                sellerId,
                limitCount,
                switchFlag,
                redBagId
            },
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: { list: [{ prizeName: "0.5元乘车券", prizeAmount: "" }] }
                }
            }
        };
    },
    babycareCheck(_, { userId }) {
        return {
            url: '/openapi/user/babycare/userid/qz/check',
            method: "GET",
            nextAction: ["actionBabycareCheck"],
            retry: true,
            data: {
                userId
            },
            businessConfig: {
                urlType: '',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: {}
                }
            }
        };
    },
};
