package com.sjtu.icare.modules.elder.service;

import java.util.List;
import java.util.Map;

import com.sjtu.icare.common.persistence.Page;
import com.sjtu.icare.modules.elder.entity.ElderEntity;
import com.sjtu.icare.modules.sys.entity.User;

public interface IElderInfoService {

	ElderEntity getElderEntity(ElderEntity elderEntity);
	
	public Page<ElderEntity> findElder(Page<ElderEntity> page, ElderEntity elder);

	/**
	 * @Title getAllElders
	 * @Description TODO
	 * @param @param requestParamMap
	 * @param @return
	 * @return List<User>
	 * @throws
	 */
	List<User> getAllElders(Map<String, Object> paramMap);

	/**
	 * @Title insertElder
	 * @Description TODO
	 * @param @param postElderEntity
	 * @param @return
	 * @return Integer
	 * @throws
	 */
	Integer insertElder(ElderEntity elderEntity);

	/**
	 * @Title updateElder
	 * @Description TODO
	 * @param @param elderEntity
	 * @return void
	 * @throws
	 */
	void updateElder(ElderEntity elderEntity);

	/**
	 * @Title deleteElder
	 * @Description TODO
	 * @param @param postElderEntity
	 * @return void
	 * @throws
	 */
	void deleteElder(ElderEntity elderEntity);
	
	
}