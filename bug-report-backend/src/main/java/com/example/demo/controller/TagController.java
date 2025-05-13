package com.example.demo.controller;

import com.example.demo.entities.Tag;
import com.example.demo.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Clasa de control pentru Taguri. Nu contine logica, doar apeleaza serviciile.
 */
@RestController
@RequestMapping("/tag")
public class TagController {

    @Autowired
    private TagService tagService;

    @PostMapping("/addTag")
    public Tag addTag(@RequestBody Tag tag) {
        return tagService.addTag(tag);
    }

    @GetMapping("/getTag/{id}")
    public Tag getTagById(@PathVariable Long id) {
        return tagService.findById(id);
    }

    @GetMapping("/getAllTags")
    public List<Tag> getAllTags() {
        return tagService.findAll();
    }

    @PutMapping("/updateTag/{id}")
    public Tag updateTag(@PathVariable Long id, @RequestBody Tag tag) {
        return tagService.updateTag(id, tag);
    }

    @DeleteMapping("/deleteTag/{id}")
    public String deleteTag(@PathVariable Long id) {
        return tagService.deleteTag(id);
    }

    @GetMapping("/getTagByName/{name}")
    public Tag getTagByName(@PathVariable String name) {
        return tagService.findByName(name);
    }
}
