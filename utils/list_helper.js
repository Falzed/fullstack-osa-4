const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let summa = 0
    blogs.forEach(blog => {
        summa += blog.likes
    });
    return summa
}

module.exports = {
    dummy,
    totalLikes
}