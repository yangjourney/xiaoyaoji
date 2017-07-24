package cn.com.xiaoyaoji.core.plugin;


/**
 * @author zhoujingjie
 *         created on 2017/5/18
 */
public class PluginInfo<T extends Plugin>{
    private String id;
    private String name;
    private String description;
    private String author;
    private String createTime;
    private String clazz;
    private String version;
    private String event;
    private Icon icon;
    private T plugin;
    //运行时文件夹
    private String runtimeFolder;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getClazz() {
        return clazz;
    }

    public void setClazz(String clazz) {
        this.clazz = clazz;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public T getPlugin() {
        return plugin;
    }

    public void setPlugin(T plugin) {
        this.plugin = plugin;
    }

    public Icon getIcon() {
        return icon;
    }

    public void setIcon(Icon icon) {
        this.icon = icon;
    }

    public String getRuntimeFolder() {
        return runtimeFolder;
    }

    public void setRuntimeFolder(String runtimeFolder) {
        this.runtimeFolder = runtimeFolder;
    }
}
