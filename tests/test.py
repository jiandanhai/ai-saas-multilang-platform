def test_max_left_zero():
    # 测试 left 为正数
    assert max(5, 0) == 5
    # 测试 left 为零
    assert max(0, 0) == 0
    # 测试 left 为负数
    assert max(-3, 0) == 0
    print("所有测试通过！")


test_max_left_zero()