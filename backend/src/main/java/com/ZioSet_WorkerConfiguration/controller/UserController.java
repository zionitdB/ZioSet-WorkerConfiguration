package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.UserInfo;
import com.ZioSet_WorkerConfiguration.rolepermission.service.UserServicesZioSet;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserServicesZioSet userService;

    @GetMapping({"/getUserInfoCount"})
    public int getUserInfoCount() {
        int count = 0;
        try {
            count = this.userService.getUserInfoCount();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return count;
    }

    @GetMapping({"/getAll"})
    public List<UserInfo> getUser() {
        List<UserInfo> userInfoList = new ArrayList<>();
        try {
            userInfoList = this.userService.getAllUsers();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return userInfoList;
    }

    @GetMapping({"/getAllByPagination"})
    public List<UserInfo> getUserByPagination(@RequestParam(defaultValue = "1") int page,
                                              @RequestParam(defaultValue = "10") int pageNo) {
        List<UserInfo> userInfoList = new ArrayList<>();
        try {
            userInfoList= this.userService.getUserByLimit(page, pageNo);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return userInfoList;
    }

    @PostMapping({"/getUserInfoByLimitAndGroupSearch"})
    public List<UserInfo> getUserInfoByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        List<UserInfo> list = new ArrayList<>();
        try {
            list = this.userService.getUserInfoByLimitAndGroupSearch(groupSearchDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @PostMapping({"/getCountUserInfoByLimitAndGroupSearch"})
    public int getUserInfoCountByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        int count = 0;
        try {
            count = this.userService.getUserInfoCountByLimitAndGroupSearch(groupSearchDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return count;
    }

    @PostMapping({"/addUser"})
    public ResponseEntity addUser(@RequestBody UserInfo userInfo) {
        ResponceObj responceDTO = new ResponceObj();
        try {
            userService.saveUser(userInfo);
        } catch (Exception e) {
            e.printStackTrace();
            responceDTO.setCode(500);
            responceDTO.setMessage(e.getMessage());
            return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
        }
        return null;
    }

    @PutMapping({"/updateUser"})
    public ResponseEntity updateUser(@RequestBody UserInfo userInfo) {
        ResponceObj responceDTO = new ResponceObj();
        try {
            userService.saveUser(userInfo);
        } catch (Exception e) {
            e.printStackTrace();
            responceDTO.setCode(500);
            responceDTO.setMessage(e.getMessage());
            return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
        }
        return null;
    }

    @DeleteMapping({"/{id}"})
    public ResponseEntity deleteUser(@PathVariable Integer id) {
        ResponceObj responceDTO = new ResponceObj();
        try {
            userService.deleteUser(id);
        } catch (Exception e) {
            e.printStackTrace();
            responceDTO.setCode(500);
            responceDTO.setMessage(e.getMessage());
            return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
        }
        return null;
    }

}
