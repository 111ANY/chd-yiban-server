<?php

namespace app\admin\controller\dormitory;

use app\common\controller\Backend;

/**
 * 
 *
 * @icon fa fa-circle-o
 */
class Select extends Backend
{
    
    /**
     * FreshList模型对象
     * @var \app\admin\model\FreshList
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('FreshList');
        $this->view->assign("statusList", $this->model->getStatusList());
    }
    
    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */
    /**
     * 查看
     */
    public function index()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('pkey_name'))
            {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                    ->where($where)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();

            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);
            $data = $this -> model -> getTableData();
            //return json($result);
            $data = array("total" => $total, "rows" => $data);
            return json($data);

        }
        return $this->view->fetch();
    }

    /**
     * 读取楼号,联动列表
     */
    public function building()
    {
        $province = $this->request->get('building');
        $city = $this->request->get('dormitory');
        // $where = ['pid' => 0, 'level' => 1];
        // $provincelist = null;
        // if ($province !== '') {
        //     if ($province) {
        //         $where['pid'] = $province;
        //         $where['level'] = 2;
        //     }
        //     if ($city !== '') {
        //         if ($city) {
        //             $where['pid'] = $city;
        //             $where['level'] = 3;
        //         }
        //         $provincelist = Db::name('area')->where($where)->field('id as value,name')->select();
        //     }
        // }
        $buildinglist = Db::name('fresh_dormitory') -> group('LH') -> select();
        $this->success('', null, $buildinglist);
    }

}
