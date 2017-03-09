# 断言（assertion）
是指在开发期间使用的、让程序在运行时进行自检的代码（通常是一个子程序或宏）。断言为真，则表明程序运行正常，而断言为假，则意味着它已经在代码中发现了意料之外的错误。断言对于大型的复杂程序或可靠性要求极高的程序来说尤其有用。
有关断言的详细信息，推荐大家一定去看《代码大全2》中“防御式编程”这一章。下面，摘录一些代码大全中有关断言使用的经典指导性建议：

	1	用错误处理代码来处理预期会发生的状况，用断言来处理绝不应该发生的状况。
	2	避免把需要执行的代码放到断言中
	3	用断言来注解并验证前条件和后条件
	4	对于高健壮性的代码，应该先使用断言再处理错误
对来源于内部系统的可靠的数据使用断言，而不要对外部不可靠的数据使用断言，对于外部不可靠数据，应该使用错误处理代码。断言可以看成可执行的注释。
系统外部的数据（用户输入，文件，网络读取等等）都是不可信的，需要严格检查（通常是错误处理）才能放行到系统内部，这相当于一个守卫。而对于系统内部的交互（比如子程序调用），如果每次也都去处理输入的数据，也就相当于系统没有可信的边界了，会让代码变的臃肿复杂；而事实上，在系统内部，传递给子程序预期的恰当数据应该是调用者的责任，系统内的调用者应该确保传递给子程序的数据是恰当可以正常工作的。这样一来，就隔离了不可靠的外部环境和可靠的系统内部环境，降低复杂度。
但是在开发阶段，代码极可能包含缺陷，也许是处理外部数据的程序考虑的不够周全，也许是调用系统内部子程序的代码存在错误，造成子程序调用失败。这个时候，断言就可以发挥作用，用来确诊到底是那部分出现了问题而导致子程序调用失败。在清理了所有缺陷之后，内外有别的信用体系就建立起来。等到发行版时候，这些断言就应该没有存在必要。

在iOS开发中，可以使用宏NSAssert()在程序中进行断言处理。NSAssert()使用正确，可以帮助开发者尽快定位bug。开发者没有必要在应用程序的每个版本中都进行断言检查，这是因为大多数项目都是有两个版本：Debug版和Release版。在Debug版中，开发者希望所有的断言都检查到，而在Release版中，往往都是禁用断言检查的。设置Release版本中禁用断言的方法如下：
在Build Settings菜单，找到Preprocessor Macros项，Preprocessor Macros项下面有一个选择，用于程序生成配置：Debug版和Release版。选择 Release项，设置NS_BLOCK_ASSERTIONS，不进行断言检查。如下图所示。

下面，我们在一个 打印名字的函数里面，加入断言，以使程序在发现输入的名字为空时，抛出异常。

[objc] view plain copy

print?
	1	- (void)printMyName:(NSString *)myName  
	2	{  
	3	    NSAssert(myName != nil, @"名字不能为空！");  
	4	    NSLog(@"My name is %@.",myName);  
	5	}  

当传给函数的参数（myName）为空时，断言将被执行，程序Crash，并打印出断言中的描述信息。本例中，在控制台打印出了如下的日志：


NSAssert[1268:a0b] *** Assertion failure in -[ViewController printMyName:]  
NSAssert/NSAssert/ViewController.m:38
2013-11-21 13:56:01.927 NSAssert[1268:a0b] *** Terminating app due to uncaught exception 'NSInternalInconsistencyException', reason: '名字不能为空！'
断言告诉我们，传入的参数不能为空，通过这个报错很容易就能确定错误发生的原因及位置。
如果，我们传入非空的参数，则程序会正确打印出传入的名字：
My name is UnivCore.
下面，我们将测试程序设置为Release版本，依据之前的设定，即使当传入的参数为空时，断言也不会被执行。设置为Release版本的方法如下：
依次点击Product->Scheme->Edit Scheme...(也可以直接按快捷键command + shift + ,)，选择Run 项，然后在Info面板上修改Build Configuration为Release，就可以将当前的生成配置改为Release。然后，生成并运行程序，就会生成Release版本的程序。注意，对于Archive 项，默认的生成配置就是Release。

此时，我们再运行程序，程序会打印如下语句：
My name is (null).
这说明，断言代码没有运行。

记录一下断言的学习情况。
Foundation框架中定义了两组断言相关的宏,分别是
<.1.>NSAssert / NSCAssert
<.2.>NSParameterAssert / NSCParameterAssert
这两组宏主要在语义和功能上有所差别，主要区别如下:
<.1.>如果我们需要确保方法或函数的输入参数的正确性，则应该在方法（函数体）内的顶部使用NSParameterAssert / NSCParameterAssert。其它情况下使用NSAssert / NSCAssert。
<.2.>这两组断言介于C和OC之间也是有着不同的。NSAssert /NSParameterAssert 是用于OC的上下文的。NSCAssert / NSCParameterAssert是用于C的上下文的。
当断言失败的时候，一般会报出下面的错误:
Terminating app due to uncaught exception 'NSInternalInconsistencyException', reason: 'Invalid parameter not satisfying: index<10'
Foundation为了处理断言，专门定义了一个NSAssertionHandler来处理断言失败的情况。NSAssertionHandler对象是自动创建的，用于处理失败的断言。当断言失败的时候，会传递一个字符串给NSAssertionHandler对象来描述失败的原因。每个线程都有自己的NSAssertionHandler对象。当调用时，一个断言处理器会打印包含方法和类（或函数）的错误信息，并引发一个NSInternalInconsistencyException异常，就像上面所看到的那样。我们很少直接去调用NSAssertionHandler的断言处理方法，通常都是自动调用的。
NSAssertionHandler提供了下面的三个方法并且定义了一个常量字符串，如下所示。
先介绍这个常量字符串。
NSString * const NSAssertionHandlerKey;
主要是用于在线程的threadDictionary字典中获取或者设置断言处理器。
再来介绍下面的三种方法。
<.1.>
//返回当前线程的NSAssertionHandler对象，如果当前线程没有相关的断言处理器，则该方法会创建一个，并制定给当前线程。
+ (NSAssertionHandler *)currentHandler
<.2.>
//当NSCAssert或NSCParameterAssert断言失败的时候，会调用这个方法
- (void)handleFailureInFunction:(NSString *)functionName file:(NSString *)object lineNumber:(NSInteger)fileName deion:(NSString *)line, format,...
<.3.>
//当NSAssert或NSParameterAssert断言失败的时候，会调用这个方法
- (void)handleFailureInMethod:(SEL)selector object:(id)object file:(NSString *)fileName lineNumber:(NSInteger)line deion:(NSString *)format, ...
断言的简单的使用。
NSAssert(index<10, @"参数大于10");
NSParameterAssert(index<10);
最后再补充一点，在Xcode4.2以后，在release版本中断言是默认关闭的，这是由宏NS_BLOCK_ASSERTIONS来处理的。也就是说，在编译release版本中，所有的断言调用都是无效的。

